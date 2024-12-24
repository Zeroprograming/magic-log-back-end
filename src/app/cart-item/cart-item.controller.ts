import {
  Controller,
  UseGuards,
  Request,
  Get,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartItemService } from './cart-item.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  CreateCartItemDto,
  DeleteCartItemDto,
  UpdateCartItemDto,
} from '../../models/cart-item/cart-item.dto';

@ApiTags('Cart Item')
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all cart items of the user' })
  @ApiResponse({ status: 200, description: 'Returns all cart items.' })
  @Get()
  async getCartItems(@Request() req) {
    const { id } = req.user; // Extraído del JWT
    return this.cartItemService.getCartItems(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new cart item for the user' })
  @ApiBody({ type: CreateCartItemDto })
  @ApiResponse({ status: 201, description: 'Cart item created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('create')
  async createCartItem(@Body() cartItem: CreateCartItemDto, @Request() req) {
    const { id } = req.user; // Extraído del JWT
    return this.cartItemService.createCartItem(id, cartItem);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a cart item for the user' })
  @ApiBody({ type: DeleteCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart item deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Delete('delete')
  async deleteCartItem(@Body() cartItem: DeleteCartItemDto, @Request() req) {
    const { id } = req.user; // Extraído del JWT
    return this.cartItemService.deleteCartItem(id, cartItem);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a cart item for the user' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Put('update')
  async updateCartItem(@Body() cartItem: UpdateCartItemDto, @Request() req) {
    const { id } = req.user; // Extraído del JWT
    return this.cartItemService.updateCartItem(id, cartItem);
  }
}
