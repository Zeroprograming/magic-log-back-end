import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseModule } from '../../databases/database.module';
import { AuthService } from './auth.service';
import { userRepositoryProvider } from '../../databases/postgres/providers/user.providers';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { roleRepositoryProvider } from '../../databases/postgres/providers/role.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    AuthService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...roleRepositoryProvider,
  ],
  controllers: [AuthController],
})
export class AppAuthModule {}
