import FastifyMultipart from '@fastify/multipart';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { envNumber } from '@/utils/globalenv.utils';

const app: FastifyAdapter = new FastifyAdapter({
  // @see https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
  trustProxy: true,
  logger: false,
  // forceCloseConnections: true,
});

/** Fastify配置 */
function setFastifyApp(app: FastifyAdapter) {
  app.register(FastifyMultipart, {
    limits: {
      fields: envNumber('UPLOAD_MAX_FIELDS'), // 允许的最大非文件字段数量
      fileSize: envNumber('UPLOAD_MAX_FILE_SIZE') * 1024 * 1024, // 单个文件最大字节数 10M
      files: envNumber('UPLOAD_MAX_FILES'), // 允许同时上传的文件数量
    },
    throwFileSizeLimit: true,
  });

  app.getInstance().addHook('onRequest', (request, reply, done) => {
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
    if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) return reply.code(204).send();

    done();
  });
}

export { app as fastifyApp, setFastifyApp };
