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
    let skip = 0;

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
    const delay = 1000; // 2 seconds delay between file uploads
    
    try {
      const baseUrl = 'https://curator.bestgradez.com/api/pdf/';
  
      if (paperInfo.qp_url) {
        const completeUrl = `${baseUrl}${paperInfo.qp_url}`;
        await this.s3Service.uploadFile(completeUrl, paperInfo.qp_url);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      if (paperInfo.ms_url) {
        const completeUrl = `${baseUrl}${paperInfo.ms_url}`;
        await this.s3Service.uploadFile(completeUrl, paperInfo.ms_url);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      if (paperInfo.ci_url) {
        const completeUrl = `${baseUrl}${paperInfo.ci_url}`;
        await this.s3Service.uploadFile(completeUrl, paperInfo.ci_url);

      }
      this.logger.log(`Processed paperInfo ${paperInfo.id}`);
    } catch (error) {
      this.logger.error(`Error processing paperInfo ${paperInfo.id}:`, error.stack);
      throw error; // Rethrow the error to be caught by the caller
    }
  }


  // method to queue question images with start and end range so multiple queues can be created
  async queueQuestionImagesForMigration(start: number, end: number, queueName: string) {
    const batchSize = 10;
    let skip = start;
  
    while (skip <= end) {
      const questionImages = await this.prisma.questionInfo.findMany({
        select: { unique_question_id: true, question_image: true, extra_question_images: true },
        skip,
        take: batchSize,
      });
  
      if (questionImages.length === 0) break;
  
      for (const questionImage of questionImages) {
        this.logger.log(`Queuing questionImage ${questionImage.unique_question_id} for migration in ${queueName}...`);
        await this.amqpConnection.publish(
          '',
          queueName,
          questionImage,
        );
      }
  
      skip += batchSize;
      this.logger.log(`Queued ${skip} question images for migration in ${queueName}...`);
    }
  
    this.logger.log(`All question images queued for migration in ${queueName}.`);
    return true;
  }

  // process image migrations tasks
  async processQuestionImageMigrationTask(questionInfo: any) {
    this.logger.log(`Processing question ${questionInfo.id}`);
    const delay = 1000; // 2 seconds delay between file uploads
    
    try {
      const baseUrl = 'https://curator.bestgradez.com/api/images/';
      if (questionInfo.question_image) {
        const completeUrl = `${baseUrl}${questionInfo.question_image}`;
        await this.s3Service.uploadImageFile(completeUrl, questionInfo.question_image);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // check if there are extra images array
      if (questionInfo.extra_question_images && questionInfo.extra_question_images.length > 0) {
        for (const extraImage of questionInfo.extra_question_images) {
          const completeUrl = `${baseUrl}${extraImage}`;
          await this.s3Service.uploadImageFile(completeUrl, extraImage);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      this.logger.log(`Processed question ${questionInfo.id}`);
    } catch (error) {
      this.logger.error(`Error processing question ${questionInfo.id}:`, error.stack);
      throw error; // Rethrow the error to be caught by the caller
    }
  }


  
}