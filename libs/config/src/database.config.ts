import { env, envNumber } from '@nest-app/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const databaseRegToken = 'database';

export const DatabaseConfig = registerAs(databaseRegToken, () => ({
  host: env('DB_HOST', '127.0.0.1'),
  port: envNumber('DB_PORT', 3306),
  database: env('DB_DATABASE'),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  connectionLimit: envNumber('DB_CONNECTION_LIMIT', 5),
}));

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>;
