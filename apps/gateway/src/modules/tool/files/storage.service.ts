import type { ConfigKeyPaths } from '@nest-app/config';

import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService<ConfigKeyPaths, true>) {
    const file = config.get('file', { infer: true });
    this.bucket = file.bucket;
    this.client = new S3Client({
      endpoint: file.endpoint,
      region: file.region,
      forcePathStyle: file.forcePathStyle,
      credentials: {
        accessKeyId: file.accessKey,
        secretAccessKey: file.secretKey,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`RustFS bucket created: ${this.bucket}`);
    }
  }

  async put(key: string, body: Buffer, contentType: string) {
    return this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType }),
    );
  }

  async get(key: string) {
    return this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async delete(key: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  getBucket() {
    return this.bucket;
  }
}
