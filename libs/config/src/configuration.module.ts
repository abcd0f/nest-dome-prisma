import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { FileConfig } from './file.config';
import { SwaggerConfig } from './swagger.config';

export const configLoaders = [AppConfig, DatabaseConfig, FileConfig, SwaggerConfig] as const;

/** Shared configuration boundary for the monolithic application. */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...configLoaders],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigurationModule {}
