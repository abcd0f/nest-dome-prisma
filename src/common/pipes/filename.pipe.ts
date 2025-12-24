import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileNamePipe implements PipeTransform {
  transform(value: Express.Multer.File | Express.Multer.File[]) {
    if (Array.isArray(value)) {
      return value.map(file => this.handleFile(file));
    }
    return this.handleFile(value);
  }

  private handleFile(file: Express.Multer.File): Express.Multer.File {
    try {
      // 检查是否包含非 ASCII 字符
      const hasNonAscii = /[^\x20-\x7E]/.test(file.originalname);

      if (!hasNonAscii) {
        const decoded = Buffer.from(file.originalname, 'latin1').toString('utf8');

        // 验证转换是否成功
        if (!decoded.includes('�')) {
          file.originalname = decoded;
        }
      }
    } catch (error) {
      console.error('Failed to decode filename:', error);
    }

    return file;
  }
}
