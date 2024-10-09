import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MigrationService } from './migration.service';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../linode-s3/s3.service';
import { MigrationController } from './migration.controller';

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('rabbitmq.url'),
        exchanges: [
          {
            name: 'default',
            type: 'topic',
          },
        ],
        queues: [
          {
            name: configService.get<string>('rabbitmq.queue'),
            options: {
              durable: true,
            },
          },
        ],
        prefetchCount: 1,
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 15,
          reconnectTimeInSeconds: 30,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MigrationService, PrismaService, S3Service],
  controllers: [MigrationController],
  exports: [MigrationService],
})
export class MigrationModule {}