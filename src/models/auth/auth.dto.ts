import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    default: '2',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Role is required' })
  role = 2;
}

export class LoginDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  password: string;
}

export class RoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
