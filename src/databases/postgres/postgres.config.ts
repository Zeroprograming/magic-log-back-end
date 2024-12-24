// src/databases/postgres/database.config.ts
import { DataSourceOptions } from 'typeorm';
import { EnvConfig } from '../../config/env.config'; // Importar las variables de entorno

export const getDatabaseConfig = (): DataSourceOptions => ({
  host: EnvConfig.databaseHost,
  port: EnvConfig.databasePort,
  username: EnvConfig.databaseUsername,
  password: EnvConfig.databasePassword,
  database: EnvConfig.databaseName,
  synchronize: false,
  logging: false,
  dropSchema: false,
  type: 'postgres',
  maxQueryExecutionTime: 1000,
  entities: [
    EnvConfig.isProduction
      ? 'dist/src/databases/postgres/entities/*.entity{.ts,.js}'
      : 'src/databases/postgres/entities/*.entity{.ts,.js}',
  ],
  migrations: [
    EnvConfig.isProduction
      ? 'dist/src/databases/postgres/migrations/*{.ts,.js}'
      : 'src/databases/postgres/migrations/*{.ts,.js}',
  ],
  extra: {
    connectionLimit: 10,
  },
});
