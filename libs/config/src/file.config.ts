import { env, envNumber } from '@nest-app/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const fileRegToken = 'file';

export const FileConfig = registerAs(fileRegToken, () => ({
  maxSize: envNumber('UPLOAD_MAX_FILE_SIZE'),
  maxFields: envNumber('UPLOAD_MAX_FIELDS'),
  maxFiles: envNumber('UPLOAD_MAX_FILES'),
  endpoint: env('RUSTFS_ENDPOINT', 'http://127.0.0.1:9000'),
  region: env('RUSTFS_REGION', 'us-east-1'),
  accessKey: env('RUSTFS_ACCESS_KEY', 'change-me'),
  secretKey: env('RUSTFS_SECRET_KEY', 'change-me'),
  bucket: env('RUSTFS_BUCKET', 'nest-app-files'),
  forcePathStyle: env('RUSTFS_FORCE_PATH_STYLE', 'true') === 'true',
}));

export type IFileConfig = ConfigType<typeof FileConfig>;
