import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('CartItemController', () => {
  let controller: CartItemController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CartItemService;

  const mockCartItemService = {
    getCartItems: jest.fn(),
    createCartItem: jest.fn(),
    deleteCartItem: jest.fn(),
    updateCartItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        {
          provide: CartItemService,
          useValue: mockCartItemService,
        },
      ],
    }).compile();

    controller = module.get<CartItemController>(CartItemController);
    service = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCartItems', () => {
    it('should return all cart items for the user', async () => {
      const result = [
        { id: 1, quantity: 2, product: { id: 1, name: 'Test Product' } },
      ];
      mockCartItemService.getCartItems.mockResolvedValue(result);

      const response = await controller.getCartItems({ user: { id: 1 } });
      expect(response).toEqual(result);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockCartItemService.getCartItems.mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(
        controller.getCartItems({ user: { id: 1 } }),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('createCartItem', () => {
    it('should create a new cart item', async () => {
      const createCartItemDto = { productId: 1, quantity: 2 };
      const result = { id: 1, ...createCartItemDto };
      mockCartItemService.createCartItem.mockResolvedValue(result);

      const response = await controller.createCartItem(createCartItemDto, {
        user: { id: 1 },
      });
      expect(response).toEqual(result);
    });

    it('should throw BadRequestException if creating cart item fails', async () => {
      const createCartItemDto = { productId: 1, quantity: 2 };
      mockCartItemService.createCartItem.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.createCartItem(createCartItemDto, { user: { id: 1 } }),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteCartItem', () => {
    it('should delete a cart item', async () => {
      const cartItemDto = { cartItemId: 1 };
      const result = { id: 1 };
      mockCartItemService.deleteCartItem.mockResolvedValue(result);

      const response = await controller.deleteCartItem(cartItemDto, {
        user: { id: 1 },
      });
      expect(response).toEqual(result);
    });

    it('should throw UnauthorizedException if cart item not found', async () => {
      const cartItemDto = { cartItemId: 1 };
      mockCartItemService.deleteCartItem.mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(
        controller.deleteCartItem(cartItemDto, { user: { id: 1 } }),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('updateCartItem', () => {
    it('should update a cart item', async () => {
      const updateCartItemDto = { cartItemId: 1, quantity: 3 };
      const result = { id: 1, quantity: 3 };
      mockCartItemService.updateCartItem.mockResolvedValue(result);

      const response = await controller.updateCartItem(updateCartItemDto, {
        user: { id: 1 },
      });
      expect(response).toEqual(result);
    });

    it('should throw BadRequestException if updating cart item fails', async () => {
      const updateCartItemDto = { cartItemId: 1, quantity: 3 };
      mockCartItemService.updateCartItem.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.updateCartItem(updateCartItemDto, { user: { id: 1 } }),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
