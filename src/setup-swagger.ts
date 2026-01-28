import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config';

// API 版本信息
const API_INFO = {
  description: `
## 后台管理系统 API 文档

### 接口说明
- 需要认证的接口请在请求头携带 \`Authorization: Bearer <token>\`
  `,
  version: '2.0.0',
};

export function setupSwagger(app: INestApplication, configService: ConfigService<ConfigKeyPaths, true>) {
  const { name } = configService.get<IAppConfig>('app')!;
  const { enable, path, serverUrl } = configService.get<ISwaggerConfig>('swagger')!;

  if (!enable) return;

  const swaggerPath = `${serverUrl}/${path}`;

  const swaggerOptions = new DocumentBuilder()
    .setTitle(name)
    .setDescription(API_INFO.description)
    .setVersion(API_INFO.version)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录
    },
    jsonDocumentUrl: `/${path}/json`,
  });

  return () => {
    // started log
    const logger = new Logger('SwaggerModule');
    logger.log(`Swagger UI: ${swaggerPath}`);
    logger.log(`Swagger JSON: ${swaggerPath}/json`);
  };
}
