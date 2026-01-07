import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { fileRename, getExtname, getFilePath, getFileType, getSize, saveLocalFileByStream } from '@/utils/file.util';

import { UploadFile, UploadInput } from './upload-dto';

@Injectable()
export class UploadService {
  /**
   * 单文件上传（Fastify Stream 版本）
   */
  async fileUpload(file: UploadInput): Promise<UploadFile> {
    const { filename, stream } = file;

    // 原始文件名
    const fileName = filename;

    // 扩展名
    const extName = getExtname(fileName);

    // 文件类型（图片 / 文档 / 音乐 / 视频 / 其他）
    const type = getFileType(extName);

    // 重命名后的文件名
    const name = fileRename(fileName);

    // 当前日期目录
    const currentDate = dayjs().format('YYYY-MM-DD');

    // 访问路径
    const path = getFilePath(name, currentDate, type);

    // 保存文件（通过 stream），并获取真实大小
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
