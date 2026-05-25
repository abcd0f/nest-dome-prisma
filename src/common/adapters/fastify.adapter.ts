import FastifyMultipart from '@fastify/multipart';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { envNumber } from '@/utils/globalenv.utils';

// 将正则表达式提升至模块 scope，避免每次请求都重新编译
const FAVICON_REGEX = /favicon\.ico$/;
const MANIFEST_REGEX = /manifest\.json$/;

const app: FastifyAdapter = new FastifyAdapter({
  // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
  trustProxy: true,
  logger: false,
  // forceCloseConnections: true,
});

/** Fastify配置 */
function setFastifyApp(app: FastifyAdapter) {
  // 获取底层的 Fastify 实例进行插件注册，以解决类型兼容性问题
  const fastifyInstance = app.getInstance();

  fastifyInstance.register(FastifyMultipart, {
    limits: {
      fields: envNumber('UPLOAD_MAX_FIELDS'), // 允许的最大非文件字段数量
      fileSize: envNumber('UPLOAD_MAX_FILE_SIZE') * 1024 * 1024, // 单个文件最大字节数 10M
      files: envNumber('UPLOAD_MAX_FILES'), // 允许同时上传的文件数量
    },
    throwFileSizeLimit: true,
  });

  fastifyInstance.addHook('onRequest', (request, reply, done) => {
    // set undefined origin
    const { origin } = request.headers;
    if (!origin) request.headers.origin = request.headers.host;

    // forbidden php
    const { url } = request;

    if (url.endsWith('.php')) {
      const msg = `Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.`;

      reply.raw.statusMessage = msg;

      return reply.code(418).send();
    }

    // skip favicon request
    // 使用预编译的正则表达式
    if (FAVICON_REGEX.test(url) || MANIFEST_REGEX.test(url)) return reply.code(204).send();

    done();
  });
}

export { app as fastifyApp, setFastifyApp };
