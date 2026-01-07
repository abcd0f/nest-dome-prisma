import { ConfigType, registerAs } from '@nestjs/config';

import { envNumber } from '@/utils/globalenv.utils';

export const fileRegToken = 'file';

export const FileConfig = registerAs(fileRegToken, () => ({
  /* 上传文件最大大小 */
  maxSize: envNumber('UPLOAD_MAX_FILE_SIZE'),

  /* 最大非文件字段数量 */
  maxFields: envNumber('UPLOAD_MAX_FIELDS'),

  /* 单次请求最大文件数量 */
  maxFiles: envNumber('UPLOAD_MAX_FILES'),
}));

export type IFileConfig = ConfigType<typeof FileConfig>;
