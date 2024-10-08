/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../linode-s3/s3.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
    private configService: ConfigService,
    private amqpConnection: AmqpConnection,
  ) {}

  async queueFilesForMigration() {
    const batchSize = this.configService.get<number>('batchSize') || 1000;
    let skip = 3092;

    // while (true) {
    while (true) {
      const paperInfos = await this.prisma.paperInfo.findMany({
        select: { id: true, qp_url: true, ms_url: true, ci_url: true },
        skip,
        take: batchSize,
      });

      if (paperInfos.length === 0) break;

      for (const paperInfo of paperInfos) {
        this.logger.log(`Queuing paperInfo ${paperInfo.id} for migration...`);
        await this.amqpConnection.publish(
          '',
          this.configService.get('rabbitmq.queue'),
          paperInfo,
        );
      }

      skip += batchSize;
      this.logger.log(`Queued ${skip} files for migration...`);
    }

    this.logger.log('All files queued for migration.');
    return true;
  }

  async processMigrationTask(paperInfo: any) {
    this.logger.log(`Processing paperInfo ${paperInfo.id}`);
    try {
      const baseUrl = 'https://curator.bestgradez.com/api/pdf/';
      if (paperInfo.qp_url) {
        const completeUrl = `${baseUrl}${paperInfo.qp_url}`;
        await this.s3Service.uploadFile(completeUrl, paperInfo.qp_url);
      }
      if (paperInfo.ms_url) {
        const completeUrl = `${baseUrl}${paperInfo.ms_url}`;
        await this.s3Service.uploadFile(completeUrl, paperInfo.ms_url);
      }
      if (paperInfo.ci_url) {
        const completeUrl = `${baseUrl}${paperInfo.ci_url}`;
        await this.s3Service.uploadFile(completeUrl, paperInfo.ci_url);
      }
      this.logger.log(`Processed paperInfo ${paperInfo.id}`);
    } catch (error) {
      this.logger.error(`Error processing paperInfo ${paperInfo.id}:`, error.stack);
    }
  }
}