import type { Multipart, MultipartFile } from '@fastify/multipart';
import { PrismaService } from '@nest-app/database';
import { fileRename, getExtname, getFileType, getSize } from '@nest-app/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { StorageService } from './storage.service';

export interface FileUploadResult {
  id: string;
  fileName: string;
  name: string;
  objectKey: string;
  type: string;
  mimeType: string;
  size: string;
  currentDate: string;
}

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async upload(file: MultipartFile): Promise<FileUploadResult> {
    const originalName = file.filename;
    const type = getFileType(getExtname(originalName));
    const generatedName = fileRename(originalName);
    const date = dayjs().format('YYYY-MM-DD');
    const key = `files/${date}/${type}/${generatedName}`;
    const body = await file.toBuffer();
    const size = body.length;

    try {
      const result = await this.storage.put(key, body, file.mimetype);
      const asset = await this.prisma.fileAsset.create({
        data: {
          bucket: this.storage.getBucket(),
          objectKey: key,
          originalName,
          mimeType: file.mimetype,
          category: type,
          size: BigInt(size),
          etag: result.ETag,
        },
      });

      return {
        id: asset.id,
        fileName: originalName,
        name: generatedName,
        objectKey: key,
        type,
        mimeType: file.mimetype,
        size: getSize(size),
        currentDate: date,
      };
    } catch (error) {
      throw new BadRequestException('文件上传到 RustFS 失败', { cause: error });
    }
  }

  async uploadBatch(parts: AsyncIterable<Multipart>): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];
    for await (const part of parts) {
      if (part.type !== 'file') continue;
      results.push(await this.upload(part));
    }

    if (results.length === 0) throw new BadRequestException('未检测到上传文件');
    return results;
  }

  async download(id: string) {
    const asset = await this.prisma.fileAsset.findUnique({ where: { id } });
    if (!asset || asset.deletedAt) throw new NotFoundException('文件不存在');
    const object = await this.storage.get(asset.objectKey);
    if (!object.Body) throw new NotFoundException('文件对象不存在');
    return { asset, body: object.Body };
  }

  async remove(id: string) {
    const asset = await this.prisma.fileAsset.findUnique({ where: { id } });
    if (!asset || asset.deletedAt) throw new NotFoundException('文件不存在');
    await this.storage.delete(asset.objectKey);
    await this.prisma.fileAsset.update({ where: { id }, data: { deletedAt: new Date() } });
    return { id, deleted: true };
  }
}
