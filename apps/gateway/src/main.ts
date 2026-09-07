import type { ConfigKeyPaths } from '@nest-app/config';

import path from 'node:path';

import { fastifyApp, PinoLogger, setFastifyApp } from '@nest-app/common';
import { CustomValidationPipe, HttpExceptionFilter, ResponseInterceptor } from '@nest-app/core';

import { getCorsOption, getLocalIPs } from '@nest-app/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp);

  setFastifyApp(fastifyApp);

  const config = app.get(ConfigService<ConfigKeyPaths, true>);
  const { port, prefix, resmode, logger } = config.get('app', { infer: true });

  app.useStaticAssets({ root: path.join(__dirname, '..', '..', '..', '..', 'public') });

  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(resmode as any));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors(getCorsOption());

  const pinoLogger = new PinoLogger({
    level: logger.level as any,
    logDir: logger.dir,
    enableConsole: logger.showConsole,
  });
  app.useLogger(pinoLogger);

  setupSwagger(app, config);

  await app.listen(port, '0.0.0.0');

  const localIPs = getLocalIPs();

  console.log(`\n🟢 启动成功:`);
  console.log(`\n📍 本地访问: http://localhost:${port}`);

  if (localIPs.length > 0) {
    console.log(`\n🌐 网络访问:`);
    localIPs.forEach((ip) => {
      console.log(`   http://${ip}:${port}`);
    });
  } else {
    console.log(`\n⚠️  未检测到可用网络接口`);
  }
}

bootstrap();
