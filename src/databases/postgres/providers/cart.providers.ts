import { DataSource } from 'typeorm';
import { Cart } from '../entities/cart.entity';

export const cartRepositoryProviders = [
  {
    provide: 'CART_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cart),
    inject: ['DATA_SOURCE'],
  },
];
