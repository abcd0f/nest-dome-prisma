import type { Readable } from 'node:stream';

export interface UploadFile {
  /** 原始文件名 */
  fileName: string;

  /** 重命名后的文件名 */
  name: string;

  /** 文件存储路径 */
  path: string;

  /** 文件类型，例如 image、video、document */
  type: string;

  /** 文件大小 */
  size: string;

  /** 上传日期，格式 YYYY-MM-DD */
  currentDate: string;
}

export interface UploadInput {
  /** 原始文件名 */
  filename: string;

  /** MIME 类型 */
  mimetype: string;

  /** Fastify multipart 提供的可读流 */
  stream: Readable;
}
