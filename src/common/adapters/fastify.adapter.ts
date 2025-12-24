import FastifyMultipart from '@fastify/multipart';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const app: FastifyAdapter = new FastifyAdapter({
  // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
  trustProxy: true,
  logger: false,
  // forceCloseConnections: true,
});

app.register(FastifyMultipart, {
  limits: {
    fields: 10, // 允许的最大非文件字段数量
    fileSize: 1024 * 1024 * 10, // 单个文件的最大字节数 10M
    files: 5, // 允许同时上传的文件数量
  },
});

export { app as fastifyApp };
