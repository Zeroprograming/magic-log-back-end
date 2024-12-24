import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../../databases/postgres/entities/product.entity';
import { User } from '../../databases/postgres/entities/user.entity';
import { Cart } from '../../databases/postgres/entities/cart.entity';
import { CartItem } from '../../databases/postgres/entities/cart-item.entity';
import { CartService } from '../cart/cart.service';
import {
  CreateCartItemDto,
  DeleteCartItemDto,
  UpdateCartItemDto,
} from '../../models/cart-item/cart-item.dto';

@Injectable()
export class CartItemService {
  constructor(
    @Inject('CART_ITEM_REPOSITORY')
    private readonly cartItemRepository: Repository<CartItem>,
    @Inject('CART_REPOSITORY')
    private readonly cartRepository: Repository<Cart>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Product>,
    private readonly cartService: CartService,
  ) {}

  async getCartItems(userId: number) {
    // 1. Verificar si el usuario existe
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found.');
    }

    // 2. Verificar si el usuario tiene un carrito
    const existingCart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!existingCart) {
      // response 204 no content
      return [];
    }

    // 3. Obtener los items del carrito
    return this.cartItemRepository.find({
      where: { cart: { id: existingCart.id } },
      relations: ['product'],
    });
  }

  async createCartItem(userId: number, cartItem: CreateCartItemDto) {
    const { productId, quantity } = cartItem;

    // 1. Verificar si el usuario existe
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found.');
    }

    // 2. Verificar si el producto existe
    const existingProduct = await this.productRepository.findOne({
      where: { id: productId },
      select: ['id', 'quantity'],
    });

    if (!existingProduct || existingProduct.quantity < quantity) {
      throw new UnauthorizedException('Product not found or not enough stock.');
    }

    // 3. Verificar si el usuario tiene un carrito
    let existingCart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!existingCart) {
      existingCart = await this.cartService.createCart(userId);
    }

    // 4. Verificar si el producto ya está en el carrito
    const existingCartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: existingCart.id }, product: { id: productId } },
    });

    if (existingCartItem) {
      // Si el producto ya está en el carrito, incrementamos la cantidad
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > existingProduct.quantity) {
        throw new UnauthorizedException('Not enough stock for the product.');
      }

      existingCartItem.quantity = newQuantity;

      try {
        await this.cartItemRepository.save(existingCartItem);
        return existingCartItem;
      } catch (error) {
        throw new BadRequestException('Error updating the cart item.', error);
      }
    }

    // 5. Crear el item del carrito si no existe
    const newCartItem = this.cartItemRepository.create({
      cart: { id: existingCart.id },
      product: { id: productId },
      quantity,
    });

    try {
      await this.cartItemRepository.save(newCartItem);
      return newCartItem;
    } catch (error) {
      throw new BadRequestException('Error creating the cart item.', error);
    }
  }

  async deleteCartItem(userId: number, cartItem: DeleteCartItemDto) {
    const { cartItemId } = cartItem;

    // 1. Verificar si el usuario existe
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found.');
    }

    // 2. Verificar si el item del carrito existe
    const existingCartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart', 'cart.user'],
    });

    if (!existingCartItem) {
      throw new UnauthorizedException('Cart item not found.');
    }

    // 3. Verificar si el item del carrito pertenece al usuario
    if (existingCartItem.cart.user.id !== userId) {
      throw new UnauthorizedException('Cart item does not belong to the user.');
    }

    // 4. Eliminar el item del carrito
    try {
      await this.cartItemRepository.delete(cartItemId);
      return existingCartItem;
    } catch (error) {
      throw new BadRequestException('Error deleting the cart item.', error);
    }
  }

  async updateCartItem(userId: number, cartItem: UpdateCartItemDto) {
    const { cartItemId, quantity } = cartItem;

    // 1. Verificar si el usuario existe
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found.');
    }

    // 2. Verificar si el item del carrito existe
    const existingCartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart', 'cart.user', 'product'], // Incluye la relación con el producto
    });

    if (!existingCartItem) {
      throw new UnauthorizedException('Cart item not found.');
    }

    // 3. Verificar si el item del carrito pertenece al usuario
    if (existingCartItem.cart.user.id !== userId) {
      throw new UnauthorizedException('Cart item does not belong to the user.');
    }

    // 4. Verificar el stock disponible del producto
    const availableStock = existingCartItem.product.quantity; // Suponiendo que `product.quantity` es el stock disponible

    if (quantity > availableStock) {
      throw new BadRequestException(
        `Requested quantity (${quantity}) exceeds available stock (${availableStock}).`,
      );
    }

    // 5. Eliminar el item si la cantidad es menor o igual a 0
    if (quantity <= 0) {
      const deletedCartItem = await this.deleteCartItem(userId, { cartItemId });
      return { ...deletedCartItem, quantity: 0 };
    }

    // 6. Actualizar la cantidad del item del carrito
    try {
      await this.cartItemRepository.update(cartItemId, { quantity });
      return { ...existingCartItem, quantity };
    } catch (error) {
      throw new BadRequestException('Error updating the cart item.', error);
    }
  }
}
