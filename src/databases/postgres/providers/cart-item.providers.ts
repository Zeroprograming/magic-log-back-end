import { DataSource } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';

export const cartItemRepositoryProvider = [
  {
    provide: 'CART_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
    inject: ['DATA_SOURCE'],
  },
];
