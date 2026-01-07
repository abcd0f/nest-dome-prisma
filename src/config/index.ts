import { AppConfig, appRegToken, IAppConfig } from './app.config';

import { FileConfig, fileRegToken, IFileConfig } from './file.config';

export * from './app.config';
export * from './file.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [fileRegToken]: IFileConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  FileConfig,
};
