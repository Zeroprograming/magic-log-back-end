import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseModule } from '../../databases/database.module';
import { userRepositoryProvider } from '../../databases/postgres/providers/user.providers';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { UserService } from './user.service';
import { roleRepositoryProvider } from '../../databases/postgres/providers/role.providers';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    UserService,
    JwtStrategy,
    ...roleRepositoryProvider,
    ...userRepositoryProvider,
  ],
  controllers: [UserController],
})
export class UserModule {}
