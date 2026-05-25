import { defineConfig } from 'prisma/config';
import { DatabaseConfig } from './src/config/database.config';

import 'dotenv/config';

const db = DatabaseConfig();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: `mysql://${db.username}:${db.password}@${db.host}:${db.port}/${db.database}`,
  },
});
