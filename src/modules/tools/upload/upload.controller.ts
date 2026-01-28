import type { FastifyRequest } from 'fastify';
import { BadRequestException, Controller, HttpStatus, Post, Req } from '@nestjs/common';

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
    try {
      const file = await req.file();

      if (!file) {
        throw new BadRequestException({
          code: HttpStatus.BAD_REQUEST,
          message: '未检测到上传文件',
        });
      }

      const result = await this.uploadService.fileUpload({
        filename: file.filename,
        mimetype: file.mimetype,
        stream: file.file, // 重点：ReadableStream
      });

      return { data: result, msg: '上传成功' };
    } catch (error) {
      throw this.handleError(error, '文件上传失败');
    }
  }

  /**
   * 多文件上传
   */
  @Post('files')
  async uploadFiles(@Req() req: FastifyRequest) {
    try {
      const parts = req.parts();

      const results: UploadFileDto[] = [];

      for await (const part of parts) {
        if (part.type !== 'file') continue;

        const result = await this.uploadService.fileUpload({
          filename: part.filename,
          mimetype: part.mimetype,
          stream: part.file,
        });

        results.push(result);
      }

      if (results.length === 0) {
        throw new BadRequestException({
          code: HttpStatus.BAD_REQUEST,
          message: '未检测到上传文件',
        });
      }

      return { data: results, msg: '上传成功' };
    } catch (error) {
      throw this.handleError(error, '文件批量上传失败');
    }
  }

  /**
   * 统一错误处理方法
   * @param error 错误对象
   * @param defaultMessage 默认错误消息
   */
  private handleError(error: any, defaultMessage: string): BadRequestException {
    // 处理 Fastify 特定错误
    if (error?.code?.startsWith('FST_')) {
      return new BadRequestException({
        code: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || '服务器内部错误',
      });
    }

    // 处理已经是 BadRequestException 的情况
    if (error instanceof BadRequestException) {
      const response = error.getResponse();

      // 如果已经是正确格式，直接返回
      if (typeof response === 'object' && 'code' in response && 'message' in response) {
        return error;
      }

      // 否则格式化为统一格式
      return new BadRequestException({
        code: error.getStatus(),
        message: typeof response === 'string' ? response : (response as any).message || defaultMessage,
      });
    }

    // 处理其他类型的错误
    return new BadRequestException({
      code: HttpStatus.BAD_REQUEST,
      message: error?.message || defaultMessage,
    });
  }
}
