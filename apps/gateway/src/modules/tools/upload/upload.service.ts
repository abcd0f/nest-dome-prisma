import { fileRename, getExtname, getFilePath, getFileType, getSize, saveLocalFileByStream } from '@nest-app/utils';

import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { UploadFileDto, UploadInput } from './upload-dto';

@Injectable()
export class UploadService {
  async fileUpload(file: UploadInput): Promise<UploadFileDto> {
    const { filename, stream } = file;

    const fileName = filename;
    const extName = getExtname(fileName);
    const type = getFileType(extName);
    const name = fileRename(fileName);
    const currentDate = dayjs().format('YYYY-MM-DD');
    const path = getFilePath(name, currentDate, type);

    const { size, truncated } = await saveLocalFileByStream(stream, name, currentDate, type);

    if (truncated) {
      throw new BadRequestException({ code: HttpStatus.BAD_REQUEST, message: '文件大小不能超过 10MB' });
    }

    return {
      fileName,
      name,
      path,
      type,
      size: getSize(size),
      currentDate,
    };
  }
}
