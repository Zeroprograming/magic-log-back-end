import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleDto } from '../auth/auth.dto';
import { CartDto } from '../cart/car.dto';
import {
  FiltroBaseDto,
  MetaDataResponse,
} from '../../common/decorators/rol.decorator';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UserProfileDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: () => RoleDto })
  role: RoleDto;

  @ApiProperty({ type: () => CartDto, nullable: true })
  cart?: CartDto;
}

export class UserProfileFiltersDto extends FiltroBaseDto {
  @ApiPropertyOptional({ description: 'The name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'The email of the user' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'The role of the user' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  role?: number;
}

export class ListaUsuariosResponse {
  @ApiProperty({ type: () => UserProfileDto, isArray: true })
  users: UserProfileDto[];

  @ApiProperty()
  meta: MetaDataResponse;
}
