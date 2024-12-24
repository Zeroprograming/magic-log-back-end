import { postgresProviders } from './postgres/postgres.providers';
// Importa otros proveedores en el futuro
// import { sqlServerProviders } from './sqlserver/sqlserver.providers';

export const databaseProviders = [
  ...postgresProviders,
  // Agrega aquí otros proveedores, por ejemplo:
  // ...sqlServerProviders,
];
