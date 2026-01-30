import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config';

// API 版本信息
const API_INFO = {
  description: `
# 后台管理系统 API 文档

**版本**：2.0.0
**概述**：本系统提供后台管理相关的所有接口，涵盖用户、权限、数据管理等功能模块。

**认证说明**：
- 所有受保护接口需在请求头携带 Token：
\`\`\`http
Authorization: Bearer <your-token>
\`\`\`

**使用建议**：
- 接口返回数据遵循统一响应格式。
- GET 请求可通过 query 参数分页或筛选。
- POST/PUT 请求请使用 JSON body。
- 错误码遵循标准 HTTP 状态码 + 自定义业务码。

**快速开始**：
1. 登录获取 Token。
2. 在 Swagger UI 的 “Authorize” 按钮中输入 Bearer Token。
3. 调用接口并查看响应示例。

> ⚠️ 注意：文档中提供的示例仅供参考，实际参数请以接口返回为准。
`,
  version: '2.0.0',
};

export function setupSwagger(app: INestApplication, configService: ConfigService<ConfigKeyPaths, true>) {
  const { name } = configService.get<IAppConfig>('app')!;
  const { enable, path } = configService.get<ISwaggerConfig>('swagger')!;

  if (!enable) return;

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
}
