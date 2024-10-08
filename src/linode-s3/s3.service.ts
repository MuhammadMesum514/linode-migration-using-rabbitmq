import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
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
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
      });
      const fileContent = response.data;

      const params = {
        Bucket: this.configService.get('s3.bucketName'),
        Key: originalFilename,
        Body: fileContent,
      };

      const result = await this.s3.upload(params).promise();
      this.logger.log(
        `Successfully uploaded ${originalFilename} to ${result.Location}`,
      );
      return result.Location;
    } catch (error) {
      this.logger.error(
        `Error uploading file ${originalFilename}:`,
        error.stack,
      );
      throw error;
    }
  }
}
