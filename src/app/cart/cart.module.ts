import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseModule } from '../../databases/database.module';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { userRepositoryProvider } from '../../databases/postgres/providers/user.providers';
import { CartController } from './cart.controller';
import { cartRepositoryProviders } from '../../databases/postgres/providers/cart.providers';
import { CartService } from './cart.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    CartService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...cartRepositoryProviders,
  ],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
