import type { Readable } from 'node:stream';

import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import dayjs from 'dayjs';

export enum FileTypeCode {
  IMAGE = 'image',
  DOCUMENT = 'document',
  MUSIC = 'music',
  VIDEO = 'video',
  OTHER = 'other',
}

export const FileTypeLabelMap: Record<FileTypeCode, string> = {
  [FileTypeCode.IMAGE]: '图片',
  [FileTypeCode.DOCUMENT]: '文档',
  [FileTypeCode.MUSIC]: '音乐',
  [FileTypeCode.VIDEO]: '视频',
  [FileTypeCode.OTHER]: '其他',
};
export function getFileType(extName: string) {
  const documents = 'txt doc pdf ppt pps xlsx xls docx';
  const music = 'mp3 wav wma mpa ram ra aac aif m4a';
  const video = 'avi mpg mpe mpeg asf wmv mov qt rm mp4 flv m4v webm ogv ogg';
  const image = 'bmp dib pcp dif wmf gif jpg tif eps psd cdr iff tga pcd mpt png jpeg';
  if (image.includes(extName)) return FileTypeCode.IMAGE;

  if (documents.includes(extName)) return FileTypeCode.DOCUMENT;

  if (music.includes(extName)) return FileTypeCode.MUSIC;

  if (video.includes(extName)) return FileTypeCode.VIDEO;

  return FileTypeCode.OTHER;
}

export function getName(fileName: string) {
  if (fileName.includes('.')) return fileName.split('.')[0];

  return fileName;
}

export function getExtname(fileName: string) {
  return path.extname(fileName).replace('.', '');
}

/**
 * 将字节数转换为人类可读的文件大小格式
 * @param {number} bytes - 要转换的字节数
 * @param {number} decimals - 结果中小数点后保留的位数，默认为2位
 * @return {string} 文件大小格式化后的字符串
 */
export function getSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function fileRename(fileName: string) {
  const name = fileName.split('.')[0];
  const extName = path.extname(fileName);
  const time = dayjs().format('YYYYMMDDHHmmSSS');
  return `${name}-${time}${extName}`;
}

export function getFilePath(name: string, currentDate: string, type: FileTypeCode) {
  return `/upload/${currentDate}/${type}/${name}`;
}

/**
 * 通过 Stream 保存文件(Fastify 推荐)
 * @returns 返回文件真实字节大小和是否被截断
 * @throws 如果文件超出大小限制会抛出错误
 */
export async function saveLocalFileByStream(
  stream: Readable,
  name: string,
  currentDate: string,
  type: FileTypeCode,
): Promise<{ size: number; truncated: boolean }> {
  const safeName = path.basename(name);
  const dirPath = path.resolve(process.cwd(), 'public', 'upload', currentDate, type);
  await fs.promises.mkdir(dirPath, { recursive: true });

  const fullPath = path.join(dirPath, safeName);

  let size = 0;
  let truncated = false;

  stream.on('data', (chunk: Buffer) => {
    size += chunk.length;
  });

  // 监听 limit 事件
  stream.on('limit', () => {
    truncated = true;
  });

  try {
    await pipeline(stream, fs.createWriteStream(fullPath));

    // 如果文件被截断,删除已上传的文件
    if (truncated) {
      await fs.promises.unlink(fullPath);
    }

    return { size, truncated };
  } catch (error) {
    // 如果发生错误,尝试清理文件
    try {
      await fs.promises.unlink(fullPath);
    } catch {
      // 忽略删除失败的错误
    }
    throw error;
  }
}

/**
 * 删除文件
 * @param name - 文件路径(相对于 public 目录)
 * @returns Promise<boolean> - 删除成功返回 true,失败返回 false
 */
export async function deleteFile(name: string): Promise<boolean> {
  const filePath = path.resolve(process.cwd(), 'public', name);

  try {
    // 检查文件是否存在
    await fs.promises.access(filePath, fs.constants.F_OK);

    // 删除文件
    await fs.promises.unlink(filePath);

    return true;
  } catch (error) {
    // 文件不存在或删除失败
    console.error('删除文件失败:', filePath, error);
    return false;
  }
}

/**
 * 批量删除文件
 * @param names - 文件路径数组
 * @returns Promise<{success: string[], failed: string[]}> - 删除结果统计
 */
export async function deleteFiles(names: string[]): Promise<{
  success: string[];
  failed: string[];
}> {
  const success: string[] = [];
  const failed: string[] = [];

  await Promise.all(
    names.map(async (name) => {
      const result = await deleteFile(name);
      if (result) {
        success.push(name);
      } else {
        failed.push(name);
      }
    }),
  );

  return { success, failed };
}

/**
 * 删除指定目录下的所有文件
 * @param dirPath - 目录路径(相对于 public 目录)
 * @returns Promise<number> - 返回删除的文件数量
 */
export async function deleteDirectory(dirPath: string): Promise<number> {
  const fullPath = path.resolve(process.cwd(), 'public', dirPath);

  try {
    // 检查目录是否存在
    await fs.promises.access(fullPath, fs.constants.F_OK);

    // 递归删除目录及其内容
    await fs.promises.rm(fullPath, { recursive: true, force: true });

    return 1;
  } catch (error) {
    console.error('删除目录失败:', fullPath, error);
    return 0;
  }
}
