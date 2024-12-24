import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './postgres.config';

const options = getDatabaseConfig();

const dataSource = new DataSource(options);

export default dataSource;
