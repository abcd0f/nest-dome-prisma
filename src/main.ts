import type { ConfigKeyPaths } from './config';

import path from 'node:path';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { fastifyApp } from '@/common/adapters/fastify.adapter';
import { CustomLogger, ResponseInterceptor } from '@/common/interceptors';
import { CustomValidationPipe } from '@/common/pipes';

import { getCorsOption } from '@/utils/cors.utils';
import { getLocalIP } from '@/utils/localip.utils';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp);

  // 获取env变量
  const config = app.get(ConfigService<ConfigKeyPaths, true>);
  const { port, prefix, logger, resmode } = config.get('app', { infer: true });

  // 设置静态资源目录
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') });

  // 设置 api 访问前缀
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(resmode as any));
  app.enableCors(getCorsOption());
  app.useLogger(
    new CustomLogger({
      level: logger.level,
      maxFiles: logger.maxFiles,
    }),
  );

  await app.listen(port, '0.0.0.0');

  const localIP = getLocalIP();
  console.log(`\n🟢 启动成功:\n   👉 http://${localIP}:${port}\n`);
}
bootstrap();
