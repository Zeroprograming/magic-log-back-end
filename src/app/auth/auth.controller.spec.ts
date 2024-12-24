import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

// Mock de AuthService
const mockAuthService = {
  register: jest.fn(),
  validateUser: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        role: 1,
      };
      const result = { email: 'test@example.com' };
      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
    });

    it('should throw UnauthorizedException if email is already registered', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        role: 1,
      };
      mockAuthService.register.mockRejectedValue(
        new UnauthorizedException('Email is already registered.'),
      );

      try {
        await controller.register(registerDto);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('login', () => {
    it('should login a user and return tokens', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { email: 'test@example.com', id: 1, role: 'user' };
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(tokens);

      const response = { cookie: jest.fn() };
      const result = await controller.login(
        loginDto,
        response as unknown as Response,
      );

      expect(result).toEqual({ access_token: 'access_token' });
      expect(response.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh_token',
        expect.any(Object),
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      mockAuthService.validateUser.mockResolvedValue(null);

      try {
        await controller.login(loginDto, {} as Response);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 1;
      const userProfile = {
        email: 'test@example.com',
        role: { id: 1, name: 'user' },
        cart: [],
      };
      mockAuthService.getProfile.mockResolvedValue(userProfile);

      const result = await controller.getProfile({ user: { id: userId } });

      expect(result).toEqual(userProfile);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 999;
      mockAuthService.getProfile.mockResolvedValue(null);

      try {
        await controller.getProfile({ user: { id: userId } });
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('logout', () => {
    it('should clear the refresh token cookie', async () => {
      const response = { clearCookie: jest.fn() };
      const result = await controller.logout(response as unknown as Response);

      expect(result).toEqual({ message: 'Successfully logged out.' });
      expect(response.clearCookie).toHaveBeenCalledWith('refresh_token');
    });
  });
});
