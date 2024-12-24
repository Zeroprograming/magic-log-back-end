import { ApiProperty } from '@nestjs/swagger';
import { CartItemDto } from '../cart-item/cart-item.dto';

export class CartDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => [CartItemDto] })
  items: CartItemDto[];
}
