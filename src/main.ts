import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

import { CustomValidationPipe } from '@/common/pipes';
import { ResponseInterceptor, CustomLogger } from '@/common/interceptors';
import { getLocalIP } from '@/utils/localip.utils';
import { getCorsOption } from '@/utils/cors.utils';

import type { ConfigKeyPaths } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<ConfigKeyPaths, true>);

  const { port, prefix, logger } = config.get('app', { infer: true });


  // 设置 api 访问前缀
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors(getCorsOption());
  app.useLogger(
    new CustomLogger({
      level: logger.level,
      maxFiles: logger.maxFiles,
    }),
  );

  await app.listen(port, '0.0.0.0');

  // await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  // const url = await app.getUrl();
  // console.log(`\n🟢 启动成功:\n   👉 ${url}\n`);

  const localIP = getLocalIP();
  console.log(`\n🟢 启动成功:\n   👉 http://${localIP}:${port}\n`);
}
bootstrap();
