import type { FastifyRequest } from 'fastify';
import type { UploadFile } from './upload-dto';

import { BadRequestException, Controller, Post, Req } from '@nestjs/common';

import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  async uploadFile(@Req() req: FastifyRequest) {
    try {
      const file = await req.file();

      if (!file) {
        throw new BadRequestException('未检测到上传文件');
      }

      const result = await this.uploadService.fileUpload({
        filename: file.filename,
        mimetype: file.mimetype,
        stream: file.file, // 重点：ReadableStream
      });

      return { data: result, msg: '上传成功' };
    } catch (error) {
      if (error?.code?.startsWith('FST_')) {
        throw new BadRequestException({
          code: error.statusCode || 500,
          message: error.message || '服务器内部错误',
        });
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('上传失败');
    }
  }

  @Post('files')
  async uploadFiles(@Req() req: FastifyRequest) {
    try {
      const parts = req.parts();

      const results: UploadFile[] = [];

      for await (const part of parts) {
        if (part.type !== 'file') continue;

        const result = await this.uploadService.fileUpload({
          filename: part.filename,
          mimetype: part.mimetype,
          stream: part.file,
        });

        results.push(result);
      }

      return { data: results, msg: '上传成功' };
    } catch (error) {
      if (error?.code?.startsWith('FST_')) {
        throw new BadRequestException({
          code: error.statusCode || 500,
          message: error.message || '服务器内部错误',
        });
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('上传失败');
    }
  }
}
