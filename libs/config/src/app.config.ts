import { env, envBoolean, envNumber } from '@nest-app/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  name: env('APP_NAME'),
  port: envNumber('APP_PORT', 3000),
  prefix: env('API_PREFIX', '/api'),
  resmode: env('APP_RES_MODE'),
  logger: {
    level: env('LOGGER_LEVEL'),
    dir: env('LOGGER_DIR'),
    showConsole: envBoolean('LOGGER_CONSOLE'),
  },
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
