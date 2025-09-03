import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { CustomValidationPipe } from '@/common/pipes';
import { ResponseInterceptor, CustomLogger } from '@/common/interceptors';
import { getLocalIP } from '@/utils/getLocalIP';
import { getCorsOption } from '@/config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new CustomLogger({
    //   level: 'info',
    //   logDir: 'logs',
    //   enableConsole: true,
    // }),
  });

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors(getCorsOption());
  app.useLogger(
    new CustomLogger({
      level: 'info',
      logDir: 'logs',
      enableConsole: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  // await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  // const url = await app.getUrl();
  // console.log(`\n🟢 启动成功:\n   👉 ${url}\n`);

  const localIP = getLocalIP();
  console.log(`\n🟢 启动成功:\n   👉 http://${localIP}:${port}\n`);
}
bootstrap();
