import type { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequestException, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @Post()
  async upload(@Req() req: FastifyRequest) {
    const file = await req.file();
    if (!file) throw new BadRequestException('未检测到上传文件');
    return { data: await this.files.upload(file), msg: '上传成功' };
  }

  @Post('batch')
  async uploadBatch(@Req() req: FastifyRequest) {
    const results: Awaited<ReturnType<FilesService['upload']>>[] = [];
    for await (const part of req.parts()) {
      if (part.type !== 'file') continue;
      results.push(await this.files.upload(part));
    }
    if (results.length === 0) throw new BadRequestException('未检测到上传文件');
    return { data: results, msg: '上传成功' };
  }

  @Get(':id')
  async download(@Param('id') id: string, @Res() reply: FastifyReply) {
    const { asset, body } = await this.files.download(id);
    reply.header('Content-Type', asset.mimeType);
    reply.header('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(asset.originalName)}`);
    return reply.send(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { data: await this.files.remove(id), msg: '删除成功' };
  }
}
