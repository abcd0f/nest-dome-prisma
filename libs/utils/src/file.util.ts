import * as crypto from 'node:crypto';
import path from 'node:path';

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
