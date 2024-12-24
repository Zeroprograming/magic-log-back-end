import { Module } from '@nestjs/common';
import { postgresProviders } from './postgres/postgres.providers';
// Importa otros módulos de bases de datos cuando los agregues

@Module({
  providers: [...postgresProviders],
  exports: [...postgresProviders],
})
export class DatabaseModule {}
