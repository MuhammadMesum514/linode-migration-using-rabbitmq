/* eslint-disable prettier/prettier */
import { Controller, Logger, OnModuleInit, Post } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Controller('migration')
export class MigrationController implements OnModuleInit {
  private readonly logger = new Logger(MigrationController.name);
  private readonly maxRetries = 2; // Maximum number of retries

  constructor(
    private migrationService: MigrationService,
    private configService: ConfigService,
    private amqpConnection: AmqpConnection,
  ) {}

  async onModuleInit() {
    this.logger.log('MigrationController initializing...');
    await this.waitForConnection();
    this.logger.log('RabbitMQ connection established');
    this.logger.log(`RabbitMQ URL: ${this.configService.get('rabbitmq.url')}`);
    this.logger.log(`RabbitMQ Queue: ${this.configService.get('rabbitmq.queue')}`);
    this.setupConsumer();
  }

  private async waitForConnection() {
    while (!this.amqpConnection.connected) {
      this.logger.log('Waiting for RabbitMQ connection...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private setupConsumer() {
    this.amqpConnection.channel.consume('file_migration_queue', async (message) => {
      if (message) {
        this.logger.log(`Received message: ${message.content.toString()}`);
        const paperInfo = JSON.parse(message.content.toString());
        await this.handleMigrationTask(paperInfo, message);
      }
    });
    this.logger.log('Consumer set up for file_migration_queue');
  }

  @Post('start')
  async startMigration() {
    this.logger.log('Starting migration...');
    const resp = await this.migrationService.queueFilesForMigration();
    if (resp) {
      this.logger.log('Migration tasks queued successfully');
      return { message: 'Migration started' };
    }
    this.logger.error('Failed to queue migration tasks');
    return { message: 'Failed to start migration' };
  }

  @RabbitSubscribe({
    exchange: '',
    routingKey: 'file_migration_queue',
    queue: 'file_migration_queue',
  })
  async handleMigrationTask(paperInfo: any, message: any, attempt = 0) {
    try {
      this.logger.log(`Processing migration task for paperInfo ${paperInfo.id}`);
      await this.migrationService.processMigrationTask(paperInfo);
      this.logger.log(`Completed migration task for paperInfo ${paperInfo.id}`);
      this.amqpConnection.channel.ack(message); // Acknowledge the message
    } catch (error) {
      this.logger.error(`Error processing migration task for paperInfo ${paperInfo.id}: ${error.message}`);
      if (attempt < this.maxRetries) {
        this.logger.log(`Retrying processing for paperInfo ${paperInfo.id} (Attempt ${attempt + 1})`);
        await this.handleMigrationTask(paperInfo, message, attempt + 1); // Retry with incremented attempt count
      } else {
        this.logger.error(`Max retries reached for paperInfo ${paperInfo.id}. Message will not be acknowledged.`);
        // Optionally, you can add logic to requeue the message or log it to a dead-letter queue here
      }
    }
  }

  @Post('test-consume')
  async testConsume() {
    this.logger.log('Manually triggering message consumption');
    const message = await this.amqpConnection.channel.get('file_migration_queue');
    if (message) {
      this.logger.log(`Retrieved message: ${message.content.toString()}`);
      await this.handleMigrationTask(JSON.parse(message.content.toString()), message);
      return { message: 'Test consume completed' };
    } else {
      this.logger.log('No message in queue');
      return { message: 'No message found in queue' };
    }
  }
}
