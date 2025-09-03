import { ConfigType, registerAs } from '@nestjs/config';

import { env, envNumber } from '@/utils/globalenv.utils';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  name: env('APP_NAME'),
  port: envNumber('APP_PORT', 3000),
  prefix: env('APP_PREFIX', '/api'),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
