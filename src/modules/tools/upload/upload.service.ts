import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import {
  saveLocalFile,
  getSize,
  getExtname,
  getFileType,
  fileRename,
  getFilePath,
} from '@/utils/file.util';

import { UploadFile } from './upload-dto';

@Injectable()
export class UploadService {
  async fileUpload(file: Express.Multer.File): Promise<UploadFile> {
    const fileName = file.originalname;
    const size = getSize(file.size);
    const extName = getExtname(fileName);
    const type = getFileType(extName);
    const name = fileRename(fileName);
    const currentDate = dayjs().format('YYYY-MM-DD');
    const path = getFilePath(fileName, currentDate, extName);

    await saveLocalFile(file.buffer, fileName, currentDate, extName);

    return {
      fileName,
      name,
      path,
      type,
      size,
      currentDate,
    };
  }

  // async fileUploads(files: Express.Multer.File[]): Promise<any> {
  //   console.log(files, 'file');

  //   const results = [] as any[];

  //   for (const file of files) {
  //     const fileName = file.originalname;
  //     const extName = getExtname(fileName);
  //     const type = getFileType(extName);
  //     const name = fileRename(fileName);
  //     const currentDate = dayjs().format('YYYY-MM-DD');
  //     const path = getFilePath(name, currentDate, type);

  //     await saveLocalFile(file.buffer, fileName, currentDate, extName);

  //     results.push({ fileName, name, path, type, currentDate });
  //   }

  //   return { data: results };
  // }
}
