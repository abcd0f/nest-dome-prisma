/*
 * @Author: Sun wanglt-123@qq.com
 * @Date: 2025-09-02 09:49:04
 * @LastEditors: Sun wanglt-123@qq.com
 * @LastEditTime: 2025-09-08 11:47:31
 * @FilePath: \nest-prisma\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

import { CustomValidationPipe } from '@/common/pipes';
import { ResponseInterceptor, CustomLogger } from '@/common/interceptors';
import { getLocalIP } from '@/utils/localip.utils';
import { getCorsOption } from '@/utils/cors.utils';

import type { ConfigKeyPaths } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 获取env变量
  const config = app.get(ConfigService<ConfigKeyPaths, true>);
  const { port, prefix, logger, resmode } = config.get('app', { infer: true });

  // 设置静态资源目录
  app.useStaticAssets('public');

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
