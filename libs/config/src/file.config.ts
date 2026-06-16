import { envNumber } from '@nest-app/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const fileRegToken = 'file';

export const FileConfig = registerAs(fileRegToken, () => ({
  maxSize: envNumber('UPLOAD_MAX_FILE_SIZE'),
  maxFields: envNumber('UPLOAD_MAX_FIELDS'),
  maxFiles: envNumber('UPLOAD_MAX_FILES'),
}));

export type IFileConfig = ConfigType<typeof FileConfig>;
