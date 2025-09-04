import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileNamePipe implements PipeTransform {
  transform(value: Express.Multer.File | Express.Multer.File[]) {
    if (Array.isArray(value)) {
      return value.map((file) => this.handleFile(file));
    }
    return this.handleFile(value);
  }

  private handleFile(file: Express.Multer.File) {
    if (!/[^\u0000-\u00ff]/.test(file.originalname)) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
    }
    return file;
  }
}
