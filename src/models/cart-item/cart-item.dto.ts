import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ProductDto } from '../product/product.dto';

export class CreateCartItemDto {
  @ApiProperty({ description: 'The product ID' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
  quantity: number;
}

export class DeleteCartItemDto {
  @ApiProperty({ description: 'The cart item ID' })
  @IsNotEmpty({ message: 'El ID del item del carrito es obligatorio.' })
  @IsNumber()
  cartItemId: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ description: 'The cart item ID' })
  @IsNotEmpty({ message: 'El ID del item del carrito es obligatorio.' })
  @IsNumber()
  cartItemId: number;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
  quantity: number;
}

export class CartItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => ProductDto })
  product: ProductDto;

  @ApiProperty()
  quantity: number;
}
