import { ConfigType, registerAs } from '@nestjs/config';

import { env, envNumber } from '@/utils/globalenv.utils';

export const databaseRegToken = 'database';

export const DatabaseConfig = registerAs(databaseRegToken, () => ({
  /* 数据库主机地址 */
  host: env('DB_HOST', '127.0.0.1'),
  /* 数据库端口 */
  port: envNumber('DB_PORT', 3306),
  /* 数据库名称 */
  database: env('DB_DATABASE'),
  /* 数据库用户名 */
  username: env('DB_USERNAME'),
  /* 数据库密码 */
  password: env('DB_PASSWORD'),
  /* 数据库连接池数量 */
  connectionLimit: envNumber('DB_CONNECTION_LIMIT', 5),
}));

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;
