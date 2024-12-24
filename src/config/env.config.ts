// src/config/env.config.ts
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

export const EnvConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT ?? 3100,
  databaseHost: process.env.DATABASE_HOST ?? 'localhost',
  databasePort: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  databaseUsername: process.env.DATABASE_USERNAME ?? 'postgres',
  databasePassword: process.env.DATABASE_PASSWORD ?? 'postgres',
  databaseName: process.env.DATABASE_NAME ?? 'postgres',
};
