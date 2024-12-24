import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../databases/postgres/entities/user.entity';
import { Cart } from '../../databases/postgres/entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_REPOSITORY')
    private readonly cartRepository: Repository<Cart>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async createCart(userId: number) {
    // 1. Verificar si el usuario existe
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found.');
    }

    // 2. Verificar si el usuario ya tiene un carrito
    const existingCart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingCart) {
      throw new UnauthorizedException('User already has a cart.');
    }

    // 3. Crear el carrito
    const newCart = this.cartRepository.create({
      user: { id: userId }, // Relacionamos el carrito con el usuario
    });

    try {
      await this.cartRepository.save(newCart);
      return newCart;
    } catch (error) {
      throw new BadRequestException('Error creating the cart.', error);
    }
  }
}
