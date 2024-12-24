import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new cart for the user' })
  @ApiResponse({ status: 201, description: 'Cart created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('create')
  async createCart(@Request() req) {
    const { id } = req.user;
    return await this.cartService.createCart(id);
  }
}
