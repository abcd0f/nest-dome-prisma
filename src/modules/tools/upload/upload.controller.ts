import { BadRequestException, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

import { FileNamePipe } from '@/common/pipes/index';

import { UploadService } from './upload.service';
import { UploadFile } from './upload-dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(FileNamePipe) file: Express.Multer.File) {
    try {
      const data = await this.uploadService.fileUpload(file);

      return { data, msg: '上传成功' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('上传失败');
    }
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' 是前端字段名，最多接收 10 个文件
  async uploadFiles(@UploadedFiles(FileNamePipe) files: Express.Multer.File[]) {
    try {
      const results = [] as UploadFile[];
      for (const file of files) {
        const result = await this.uploadService.fileUpload(file);
        results.push(result);
      }
      return { data: results, msg: '上传成功' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('上传失败');
    }
  }
}
