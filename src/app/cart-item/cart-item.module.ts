import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseModule } from '../../databases/database.module';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { userRepositoryProvider } from '../../databases/postgres/providers/user.providers';
import { CartItemController } from './cart-item.controller';
import { productRepositoryProviders } from '../../databases/postgres/providers/product.providers';
import { cartRepositoryProviders } from '../../databases/postgres/providers/cart.providers';
import { cartItemRepositoryProvider } from '../../databases/postgres/providers/cart-item.providers';
import { CartItemService } from './cart-item.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [AuthModule, DatabaseModule, CartModule],
  providers: [
    CartItemService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...productRepositoryProviders,
    ...cartItemRepositoryProvider,
    ...cartRepositoryProviders,
  ],
  controllers: [CartItemController],
})
export class CartItemModule {}
