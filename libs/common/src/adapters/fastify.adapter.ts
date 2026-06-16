import FastifyMultipart from '@fastify/multipart';
import { envNumber } from '@nest-app/utils';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const FAVICON_REGEX = /favicon\.ico$/;
const MANIFEST_REGEX = /manifest\.json$/;

const app: FastifyAdapter = new FastifyAdapter({
  trustProxy: true,
  logger: false,
});

function setFastifyApp(app: FastifyAdapter) {
  const fastifyInstance = app.getInstance();
  fastifyInstance.register(FastifyMultipart, {
    limits: {
      fields: envNumber('UPLOAD_MAX_FIELDS'),
      fileSize: envNumber('UPLOAD_MAX_FILE_SIZE') * 1024 * 1024,
      files: envNumber('UPLOAD_MAX_FILES'),
    },
    throwFileSizeLimit: true,
  });
  fastifyInstance.addHook('onRequest', (request, reply, done) => {
    const { origin } = request.headers;
    if (!origin) request.headers.origin = request.headers.host;
    const { url } = request;
    if (url.endsWith('.php')) {
      reply.raw.statusMessage =
        'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.';
      return reply.code(418).send();
    }
    if (FAVICON_REGEX.test(url) || MANIFEST_REGEX.test(url)) return reply.code(204).send();
    done();
  });
}

export { app as fastifyApp, setFastifyApp };
