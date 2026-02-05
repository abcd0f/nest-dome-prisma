import type { ConfigKeyPaths } from './config';

import path from 'node:path';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { fastifyApp, setFastifyApp } from '@/common/adapters/fastify.adapter';
import { PinoLogger } from '@/common/logger/pino.logger';
import { HttpExceptionFilter } from '@/core/filters';
import { ResponseInterceptor } from '@/core/interceptors';

import { CustomValidationPipe } from '@/core/pipes';

import { getCorsOption } from '@/utils/cors.utils';

import { getLocalIPs } from '@/utils/localip.utils';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp);

  setFastifyApp(fastifyApp);

  // 获取env变量
  const config = app.get(ConfigService<ConfigKeyPaths, true>);
  const { port, prefix, resmode, logger } = config.get('app', { infer: true });

  // 设置静态资源目录
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') });

  // 设置 api 访问前缀
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(resmode as any));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors(getCorsOption());

  app.useLogger(
    new PinoLogger({
      level: logger.level as any,
      logDir: logger.dir,
      enableConsole: logger.showConsole,
    }),
  );

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

  console.log(); // 空行美化
}
bootstrap();
