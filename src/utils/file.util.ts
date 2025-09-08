import fs from 'node:fs';
import path from 'node:path';

import dayjs from 'dayjs';

enum Type {
  IMAGE = '图片',
  TXT = '文档',
  MUSIC = '音乐',
  VIDEO = '视频',
  OTHER = '其他',
}

export function getFileType(extName: string) {
  const documents = 'txt doc pdf ppt pps xlsx xls docx';
  const music = 'mp3 wav wma mpa ram ra aac aif m4a';
  const video = 'avi mpg mpe mpeg asf wmv mov qt rm mp4 flv m4v webm ogv ogg';
  const image = 'bmp dib pcp dif wmf gif jpg tif eps psd cdr iff tga pcd mpt png jpeg';
  if (image.includes(extName)) return Type.IMAGE;

  if (documents.includes(extName)) return Type.TXT;

  if (music.includes(extName)) return Type.MUSIC;

  if (video.includes(extName)) return Type.VIDEO;

  return Type.OTHER;
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

export function getFilePath(name: string, currentDate: string, type: string) {
  return `/upload/${currentDate}/${type}/${name}`;
}

/**
 * 将file保存到本地
 * @param {Buffer} buffer 文件buffer
 * @param {string} name 文件名
 * @param {string} currentDate 当前日期
 * @param {string} type 文件类型
 */
export async function saveLocalFile(buffer: Buffer, name: string, currentDate: string, type: string) {
  const safeName = path.basename(name);
  // 拼接目录路径
  const dirPath = path.resolve(process.cwd(), 'public', 'upload', currentDate, type);
  // 确保目录存在
  try {
    await fs.promises.stat(dirPath);
  } catch (err) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }

  // 拼接完整文件路径
  const fullPath = path.join(dirPath, safeName);
  console.log('保存路径:', fullPath);

  return new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(fullPath);

    writeStream.on('error', (err) => {
      reject(err);
    });

    writeStream.on('finish', () => {
      resolve();
    });

    writeStream.write(buffer, () => {
      writeStream.end(); // 关闭流
    });
  });
}

export async function deleteFile(name: string) {
  const filePath = path.resolve(process.cwd(), 'public', name);
  fs.unlink(filePath, () => {
    // console.log(error);
  });
}
