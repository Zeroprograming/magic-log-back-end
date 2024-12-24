import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  Min,
  IsPositive,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger'; // Usa ApiPropertyOptional en lugar de ApiProperty
import { FiltroBaseDto } from '../../common/decorators/rol.decorator';

export class ProductFiltersDto extends FiltroBaseDto {
  @ApiPropertyOptional({ description: 'The name of the product' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'The SKU of the product' }) // Descripción corregida
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Quantity of the product' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Minimum price of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceMin?: number;

  @ApiPropertyOptional({ description: 'Maximum price of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceMax?: number;

  @ApiPropertyOptional({
    description: 'Filter by user IDs who created the products',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  userIds?: number[];

  @ApiPropertyOptional({ description: 'Filter by creation date (from)' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAtFrom?: Date;

  @ApiPropertyOptional({ description: 'Filter by creation date (to)' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAtTo?: Date;
}
