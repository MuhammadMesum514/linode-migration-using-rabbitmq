/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { backOff } from 'exponential-backoff';
import axios from 'axios';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get('s3.endpoint'),
      accessKeyId: this.configService.get('s3.accessKeyId'),
      secretAccessKey: this.configService.get('s3.secretAccessKey'),
      s3ForcePathStyle: true,
      signatureVersion: 'v2',
    });
  }

  async uploadFile(fileUrl: string, originalFilename: string): Promise<string> {
    this.logger.log(`Attempting to upload file: ${fileUrl}`);

    try {
      const result = await backOff(
        () => this.performUpload(fileUrl, originalFilename),
        {
          numOfAttempts: 5,
          startingDelay: 1000,
          maxDelay: 60000,
          timeMultiple: 2,
          jitter: 'full',
        },
      );

      this.logger.log(
        `Successfully uploaded ${originalFilename} to ${result.Location}`,
      );
      return result.Location;
    } catch (error) {
      this.logger.error(
        `Error uploading file ${originalFilename} after all retry attempts:`,
        error.stack,
      );
      throw error;
    }
  }

  async uploadImageFile(fileUrl: string, originalFilename: string): Promise<string> {
    this.logger.log(`Attempting to upload file: ${fileUrl}`);

    try {
      const result = await backOff(
        () => this.performImageUpload(fileUrl, originalFilename),
        {
          numOfAttempts: 5,
          startingDelay: 1000,
          maxDelay: 60000,
          timeMultiple: 2,
          jitter: 'full',
        },
      );

      this.logger.log(
        `Successfully uploaded ${originalFilename} to ${result.Location}`,
      );
      return result.Location;
    } catch (error) {
      this.logger.error(
        `Error uploading file ${originalFilename} after all retry attempts:`,
        error.stack,
      );
      throw error;
    }
  }

  private async performUpload(fileUrl: string, originalFilename: string) {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });

    if (!response?.data) {
      this.logger.log(`File ${originalFilename} does not exist`);
      return;
    }

    const fileContent = response.data;
    const params = {
      Bucket: this.configService.get('s3.bucketName'),
      Key: originalFilename,
      Body: fileContent,
    };
    return this.s3.upload(params).promise();
  }

  private async performImageUpload(fileUrl: string, originalFilename: string) {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });

    if (!response?.data) {
      this.logger.log(`File ${originalFilename} does not exist`);
      return;
    }

    const fileContent = response.data;
    const params = {
      Bucket: this.configService.get('s3.bucketName'),
      Key: `images/${originalFilename}`,
      Body: fileContent,
    };
    return this.s3.upload(params).promise();
  }
}
