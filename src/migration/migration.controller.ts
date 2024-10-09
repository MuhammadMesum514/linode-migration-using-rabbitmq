/* eslint-disable prettier/prettier */
import { Controller, Logger, OnModuleInit, Post, Query } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Channel, ConsumeMessage } from 'amqplib';

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
    this.logger.log(
      `RabbitMQ Queue: ${this.configService.get('rabbitmq.queue')}`,
    );
  }

  private async waitForConnection() {
    while (!this.amqpConnection.connected) {
      this.logger.log('Waiting for RabbitMQ connection...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
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
  async handleMigrationTask(
    paperInfo: any,
    message: ConsumeMessage,
    channel: Channel,
  ) {
    try {
      this.logger.log(
        `Processing migration task for paperInfo ${paperInfo.id}`,
      );
      await this.migrationService.processMigrationTask(paperInfo);
      this.logger.log(`Completed migration task for paperInfo ${paperInfo.id}`);
    } catch (error) {
      this.logger.error(
        `Error processing migration task for paperInfo ${paperInfo.id}: ${error.message}`,
      );
      // Implement dead-letter logic here if needed
    } finally {
      try {
        if (channel.connection.isConnected() && channel.isOpen()) {
          await channel.ack(message);
          this.logger.log(`Acknowledged message for paperInfo ${paperInfo.id}`);
        } else {
          this.logger.warn(
            `Channel closed, unable to acknowledge message for paperInfo ${paperInfo.id}`,
          );
          // Implement logic to handle unacknowledged message
        }
      } catch (ackError) {
        this.logger.error(`Failed to acknowledge message: ${ackError.message}`);
        // Implement recovery logic if needed
      }
    }
  }

  @Post('test-consume')
  async testConsume() {
    this.logger.log('Manually triggering message consumption');
    try {
      const message = await this.amqpConnection.channel.get(
        'file_migration_queue',
      );
      if (message) {
        this.logger.log(`Retrieved message: ${message.content.toString()}`);
        await this.handleMigrationTask(
          JSON.parse(message.content.toString()),
          message,
          this.amqpConnection.channel,
        );
        return { message: 'Test consume completed' };
      } else {
        this.logger.log('No message in queue');
        return { message: 'No message found in queue' };
      }
    } catch (error) {
      this.logger.error(`Error in test consume: ${error.message}`);
      return { message: 'Error during test consume', error: error.message };
    }
  }


  // question image migration
  @Post('start-multiple-question-image-migrations')
async startMultipleQuestionImageMigrations() {
  const migrations = [
    { start: 0, end: 10, queue: 'question_image_migration_queue_1' },
    { start: 11, end: 20, queue: 'question_image_migration_queue_2' },
    { start: 21, end: 30, queue: 'question_image_migration_queue_3' },
    // Add more ranges as needed
  ];

  for (const migration of migrations) {
    await this.migrationService.queueQuestionImagesForMigration(
      migration.start,
      migration.end,
      migration.queue,
    );
  }

  return { message: 'Multiple question image migrations started' };
}


@RabbitSubscribe({
  exchange: '',
  routingKey: 'question_image_migration_queue_1',
  queue: 'question_image_migration_queue_1',
})
async handleQueue1Task(questionInfo: any, message: ConsumeMessage, channel: Channel) {
  await this.handleQuestionImageMigrationTask(questionInfo, message, channel);
}

@RabbitSubscribe({
  exchange: '',
  routingKey: 'question_image_migration_queue_2',
  queue: 'question_image_migration_queue_2',
})
async handleQueue2Task(questionInfo: any, message: ConsumeMessage, channel: Channel) {
  await this.handleQuestionImageMigrationTask(questionInfo, message, channel);
}

@RabbitSubscribe({
  exchange: '',
  routingKey: 'question_image_migration_queue_3',
  queue: 'question_image_migration_queue_3',
})
  async handleQueue3Task(questionInfo: any, message: ConsumeMessage, channel: Channel) {
    await this.handleQuestionImageMigrationTask(questionInfo, message, channel);
  }

// question image migration
  // @RabbitSubscribe({
  //   exchange: '',
  //   routingKey: 'question_image_migration_queue',
  //   queue: 'question_image_migration_queue',
  // })
  async handleQuestionImageMigrationTask(
    questionInfo: any,
    message: ConsumeMessage,
    channel: Channel,
  ) {
    try {
      this.logger.log(
        `Processing question image migration task for questionInfo ${questionInfo.id}`,
      );
      await this.migrationService.processQuestionImageMigrationTask(questionInfo);
      this.logger.log(`Completed question image migration task for questionInfo ${questionInfo.id}`);
    } catch (error) {
      this.logger.error(
        `Error processing question image migration task for questionInfo ${questionInfo.id}: ${error.message}`,
      );
      // Implement dead-letter logic here if needed
    } finally {
      try {
        if (channel?.connection?.isConnected() && channel?.isOpen()) {
          await channel.ack(message);
          this.logger.log(`Acknowledged message for questionInfo ${questionInfo.id}`);
        } else {
          this.logger.warn(
            `Channel closed, unable to acknowledge message for questionInfo ${questionInfo.id}`,
          );
          // Implement logic to handle unacknowledged message
          }
      } catch (ackError) {
        this.logger.error(`Failed to acknowledge message: ${ackError.message}`);
        // Implement recovery logic if needed
        }
    }

}
}
