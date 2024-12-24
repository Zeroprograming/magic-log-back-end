import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    createCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a new cart successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com', // Propiedad email
        password: 'password', // Propiedad password
        role: {
          id: 1,
          name: 'Admin',
          description: 'Administrator role',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        }, // Propiedad role
        products: [], // Propiedad products
        cart: null, // Agregar propiedad cart (si es un campo relacionado)
        created_at: new Date(), // Propiedad created_at
        updated_at: new Date(), // Propiedad updated_at
        deleted_at: null, // Propiedad deleted_at
        hashPassword: jest.fn(), // Propiedad hashPassword
        updatePassword: jest.fn(), // Propiedad updatePassword
        comparePassword: jest.fn(), // Propiedad comparePassword
        // Agrega otras propiedades necesarias según el modelo User
      };

      const mockCart = {
        id: 1,
        user: mockUser, // Usuario completo con todas las propiedades necesarias
        items: [], // Propiedad items
        created_at: new Date(), // Propiedad created_at
        updated_at: new Date(), // Propiedad updated_at
        deleted_at: null, // Propiedad deleted_at
      };

      jest.spyOn(service, 'createCart').mockResolvedValue(mockCart);

      const req = { user: mockUser };
      const result = await controller.createCart(req);

      expect(result).toEqual(mockCart);
      expect(service.createCart).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const mockUser = { id: 1 };
      jest
        .spyOn(service, 'createCart')
        .mockRejectedValue(new UnauthorizedException('User not found.'));

      const req = { user: mockUser };

      await expect(controller.createCart(req)).rejects.toThrowError(
        new UnauthorizedException('User not found.'),
      );
    });

    it('should throw UnauthorizedException if user already has a cart', async () => {
      const mockUser = { id: 1 };
      jest
        .spyOn(service, 'createCart')
        .mockRejectedValue(
          new UnauthorizedException('User already has a cart.'),
        );

      const req = { user: mockUser };

      await expect(controller.createCart(req)).rejects.toThrowError(
        new UnauthorizedException('User already has a cart.'),
      );
    });

    it('should throw BadRequestException if there is an error creating the cart', async () => {
      const mockUser = { id: 1 };
      jest
        .spyOn(service, 'createCart')
        .mockRejectedValue(new BadRequestException('Error creating the cart.'));

      const req = { user: mockUser };

      await expect(controller.createCart(req)).rejects.toThrowError(
        new BadRequestException('Error creating the cart.'),
      );
    });
  });
});
