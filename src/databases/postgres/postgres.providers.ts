import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './postgres.config';

const options = getDatabaseConfig();

export const postgresProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource(options);
      return dataSource.initialize();
    },
  },
];
