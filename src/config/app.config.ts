import { ConfigType, registerAs } from '@nestjs/config';

import { env, envBoolean, envNumber } from '@/utils/globalenv.utils';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  /* 系统名称 */
  name: env('APP_NAME'),
  /* 端口号 */
  port: envNumber('APP_PORT', 3000),
  /* 接口前缀 */
  prefix: env('API_PREFIX', '/api'),
  /* 返回格式模式 */
  resmode: env('APP_RES_MODE'),

  /* 日志配置 */
  logger: {
    /* 日志级别 */
    level: env('LOGGER_LEVEL'),
    /* 日志目录 */
    dir: env('LOGGER_DIR'),
    /* 是否在控制台显示 */
    showConsole: envBoolean('LOGGER_CONSOLE'),
  },
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
