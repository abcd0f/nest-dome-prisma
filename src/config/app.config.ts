import { ConfigType, registerAs } from '@nestjs/config';

import { env, envNumber } from '@/utils/globalenv.utils';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  // 系统名称
  name: env('APP_NAME'),
  // 端口号
  port: envNumber('APP_PORT', 3000),
  // 接口前缀
  prefix: env('API_PREFIX', '/api'),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
