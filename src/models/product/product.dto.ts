import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';
import { MetaDataResponse } from '../../common/decorators/rol.decorator';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The SKU of the product' })
  @IsNotEmpty({ message: 'El SKU es obligatorio.' })
  @IsString()
  sku: string;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
  quantity: number;

  @ApiProperty({ description: 'The price of the product' })
  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser un número positivo.' })
  price: number;
}

export class UpdateProductDto {
  @ApiProperty({ description: 'ID of the product' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The SKU of the product' })
  @IsString()
  sku: string;

  @ApiProperty({ description: 'The quantity of the product' })
  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
  quantity: number;

  @ApiProperty({ description: 'The price of the product' })
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser un número positivo.' })
  price: number;
}

export class ProductDto {
  @ApiProperty({ description: 'ID of the product' })
  id: number;

  @ApiProperty({ description: 'The name of the product' })
  name: string;
}

export class ProductUserResponse {
  @ApiProperty({ description: 'ID of the user' })
  id: number;

  @ApiProperty({ description: 'Name of the user' })
  email: string;
}

export class ProductResponse {
  @ApiProperty({ description: 'ID of the product' })
  id: number;

  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @ApiProperty({ description: 'The SKU of the product' })
  sku: string;

  @ApiProperty({ description: 'The quantity of the product' })
  quantity: number;

  @ApiProperty({ description: 'The price of the product' })
  price: number;

  @ApiProperty({ description: 'The creation date of the product' })
  createdAt: string;

  @ApiProperty({
    type: ProductUserResponse,
    description: 'The user who created the product',
  })
  user: ProductUserResponse;
}

export class ListaProductosResponse {
  @ApiProperty({ type: [ProductResponse], description: 'List of products' })
  products: ProductResponse[];

  @ApiProperty({ type: MetaDataResponse, description: 'Metadata' })
  metadata: MetaDataResponse;
}
