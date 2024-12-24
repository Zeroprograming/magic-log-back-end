// src/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRoleId } from '../../models/user/user-role.enum'; // Ajusta la ruta a tu enum
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleId[]) => SetMetadata(ROLES_KEY, roles);

export class MetaDataResponse {
  @ApiProperty({ description: 'Total of products' })
  total: number;

  @ApiProperty({ description: 'Products per page' })
  per_page: number;

  @ApiProperty({ description: 'Current page' })
  current_page: number;

  @ApiProperty({ description: 'Last page' })
  last_page: number;

  @ApiProperty({ nullable: true, description: 'Next page URL' })
  next_page_url: string | null;

  @ApiProperty({ nullable: true, description: 'Previous page URL' })
  prev_page_url: string | null;
}

export class FiltroBaseDto {
  @ApiPropertyOptional({ description: 'Sort field' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Page number' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
}
