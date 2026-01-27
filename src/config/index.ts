import { AppConfig, appRegToken, IAppConfig } from './app.config';

import { FileConfig, fileRegToken, IFileConfig } from './file.config';

import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config';

export * from './app.config';
export * from './file.config';
export * from './swagger.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [fileRegToken]: IFileConfig;
  [swaggerRegToken]: ISwaggerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  FileConfig,
  SwaggerConfig,
};
