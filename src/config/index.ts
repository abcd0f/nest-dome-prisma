import { AppConfig, appRegToken, IAppConfig } from './app.config';

import { DatabaseConfig, databaseRegToken, IDatabaseConfig } from './database.config';

import { FileConfig, fileRegToken, IFileConfig } from './file.config';

import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config';

export * from './app.config';
export * from './database.config';
export * from './file.config';
export * from './swagger.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [databaseRegToken]: IDatabaseConfig;
  [fileRegToken]: IFileConfig;
  [swaggerRegToken]: ISwaggerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  DatabaseConfig,
  FileConfig,
  SwaggerConfig,
};
