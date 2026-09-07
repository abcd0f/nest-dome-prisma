import { env, envBoolean, envNumber } from '@nest-app/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const redisRegToken = 'redis';

export const RedisConfig = registerAs(redisRegToken, () => ({
  enabled: envBoolean('REDIS_ENABLED', true),
  host: env('REDIS_HOST', '127.0.0.1'),
  port: envNumber('REDIS_PORT', 6379),
  username: env('REDIS_USERNAME'),
  password: env('REDIS_PASSWORD'),
  database: envNumber('REDIS_DATABASE', 0),
  keyPrefix: env('REDIS_KEY_PREFIX', 'nest-app:'),
  connectTimeout: envNumber('REDIS_CONNECT_TIMEOUT', 1000),
}));

export type IRedisConfig = ConfigType<typeof RedisConfig>;
