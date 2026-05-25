import type { FastifyRequest } from 'fastify';
import { BadRequestException, Controller, Post, Req } from '@nestjs/common';

import { UploadFileDto } from './upload-dto';

import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 单文件上传
   */
  @Post('file')
  async uploadFile(@Req() req: FastifyRequest) {
    const file = await req.file();

    if (!file) throw new BadRequestException('未检测到上传文件');

    const result = await this.uploadService.fileUpload({
      filename: file.filename,
      mimetype: file.mimetype,
      stream: file.file,
    });

    return { data: result, msg: '上传成功' };
  }

  /**
   * 多文件上传
   */
  @Post('files')
  async uploadFiles(@Req() req: FastifyRequest) {
    const results: UploadFileDto[] = [];

    for await (const part of req.parts()) {
      if (part.type !== 'file') continue;

      const result = await this.uploadService.fileUpload({
        filename: part.filename,
        mimetype: part.mimetype,
        stream: part.file,
      });

      results.push(result);
    }

    if (results.length === 0) throw new BadRequestException('未检测到上传文件');

    return { data: results, msg: '上传成功' };
  }
}
