import { AppConfig, appRegToken, IAppConfig } from './app.config';
import { DatabaseConfig, databaseRegToken, IDatabaseConfig } from './database.config';
import { FileConfig, fileRegToken, IFileConfig } from './file.config';
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config';

export * from './app.config';
export * from './configuration.module';
export * from './database.config';
export * from './file.config';
export * from './swagger.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [databaseRegToken]: IDatabaseConfig;
  [fileRegToken]: IFileConfig;
  [swaggerRegToken]: ISwaggerConfig;
}

type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
    ? T[Path]
    : Path extends `${infer K}.${infer R}`
      ? K extends keyof T
        ? PropType<T[K], R>
        : unknown
      : unknown;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type RecordNamePaths<T extends object> = {
  [K in NestedKeyOf<T>]: PropType<T, K>;
};

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  DatabaseConfig,
  FileConfig,
  SwaggerConfig,
};
