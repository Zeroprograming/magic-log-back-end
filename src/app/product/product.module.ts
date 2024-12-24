import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseModule } from '../../databases/database.module';
import { productRepositoryProviders } from '../../databases/postgres/providers/product.providers';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { ProductService } from './product.service';
import { ProductsController } from './product.controller';
import { userRepositoryProvider } from '../../databases/postgres/providers/user.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [
    ProductService,
    JwtStrategy,
    ...userRepositoryProvider,
    ...productRepositoryProviders,
  ],
  controllers: [ProductsController],
})
export class ProductModule {}
