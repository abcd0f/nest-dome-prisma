import { ConfigType, registerAs } from '@nestjs/config';

import { env, envBoolean } from '@/utils/globalenv.utils';

export const swaggerRegToken = 'swagger';

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  // 是否启用 swagger
  enable: envBoolean('SWAGGER_ENABLE'),

  // swagger 文档路径
  path: env('SWAGGER_PATH'),

  // swagger 文档服务地址
  serverUrl: env('SWAGGER_SERVER_URL', env('APP_BASE_URL')),
}));

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>;
