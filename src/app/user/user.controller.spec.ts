import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  ListaUsuariosResponse,
  UserProfileFiltersDto,
} from '../../models/user/user.dto';

// Mock data for testing
const mockUsers = [
  {
    id: 1,
    email: 'user1@example.com',
    role: { id: 1, name: 'Admin' },
    cart: null,
  },
  {
    id: 2,
    email: 'user2@example.com',
    role: { id: 2, name: 'User' },
    cart: null,
  },
];

const mockMeta = {
  total: 2,
  per_page: 10,
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
};

const mockResponse: ListaUsuariosResponse = {
  users: mockUsers,
  meta: mockMeta,
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUsersByRole: jest.fn().mockResolvedValue(mockResponse),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUsersByRole', () => {
    it('should return a list of users with metadata', async () => {
      // Arrange
      const filters: UserProfileFiltersDto = {
        name: 'user',
        email: 'example.com',
        role: 1,
        page: 1,
        limit: 10,
        sort: 'email',
        order: 'asc',
      };

      // Act
      const result = await userController.getUsersByRole(filters);

      // Assert
      expect(userService.getUsersByRole).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty filters', async () => {
      // Arrange
      const filters: UserProfileFiltersDto = {};

      // Act
      const result = await userController.getUsersByRole(filters);

      // Assert
      expect(userService.getUsersByRole).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
    });
  });
});
