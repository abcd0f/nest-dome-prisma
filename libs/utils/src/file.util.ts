import type { Readable } from 'node:stream';

import * as crypto from 'node:crypto';
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

const IMAGE_EXTS = new Set([
  'bmp',
  'dib',
  'pcp',
  'dif',
  'wmf',
  'gif',
  'jpg',
  'tif',
  'eps',
  'psd',
  'cdr',
  'iff',
  'tga',
  'pcd',
  'mpt',
  'png',
  'jpeg',
]);
const DOCUMENT_EXTS = new Set(['txt', 'doc', 'pdf', 'ppt', 'pps', 'xlsx', 'xls', 'docx']);
const MUSIC_EXTS = new Set(['mp3', 'wav', 'wma', 'mpa', 'ram', 'ra', 'aac', 'aif', 'm4a']);
const VIDEO_EXTS = new Set([
  'avi',
  'mpg',
  'mpe',
  'mpeg',
  'asf',
  'wmv',
  'mov',
  'qt',
  'rm',
  'mp4',
  'flv',
  'm4v',
  'webm',
  'ogv',
  'ogg',
]);

export function getFileType(extName: string) {
  const ext = extName.toLowerCase();
  if (IMAGE_EXTS.has(ext)) return FileTypeCode.IMAGE;
  if (DOCUMENT_EXTS.has(ext)) return FileTypeCode.DOCUMENT;
  if (MUSIC_EXTS.has(ext)) return FileTypeCode.MUSIC;
  if (VIDEO_EXTS.has(ext)) return FileTypeCode.VIDEO;
  return FileTypeCode.OTHER;
}

export function getName(fileName: string) {
  if (fileName.includes('.')) return fileName.split('.')[0];
  return fileName;
}

export function getExtname(fileName: string) {
  return path.extname(fileName).replace('.', '');
}

export function getSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function fileRename(fileName: string) {
  const { name, ext } = path.parse(fileName);
  const time = dayjs().format('YYYYMMDDHHmmss');
  const rand = crypto.randomBytes(4).toString('hex');
  return `${name}-${time}-${rand}${ext}`;
}

export function getFilePath(name: string, currentDate: string, type: FileTypeCode) {
  return `/upload/${currentDate}/${type}/${name}`;
}

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

  stream.on('limit', () => {
    truncated = true;
  });

  try {
    await pipeline(stream, fs.createWriteStream(fullPath));

    if (truncated) {
      await fs.promises.unlink(fullPath);
    }

    return { size, truncated };
  } catch (error) {
    try {
      await fs.promises.unlink(fullPath);
    } catch {}
    throw error;
  }
}

export async function deleteFile(name: string): Promise<boolean> {
  const filePath = path.resolve(process.cwd(), 'public', name);

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('删除文件失败:', filePath, error);
    return false;
  }
}

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

export async function deleteDirectory(dirPath: string): Promise<number> {
  const fullPath = path.resolve(process.cwd(), 'public', dirPath);

  try {
    await fs.promises.access(fullPath, fs.constants.F_OK);
    await fs.promises.rm(fullPath, { recursive: true, force: true });
    return 1;
  } catch (error) {
    console.error('删除目录失败:', fullPath, error);
    return 0;
  }
}
