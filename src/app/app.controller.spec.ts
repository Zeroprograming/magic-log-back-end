import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Mock data for testing
const mockUserAgent = 'Mozilla/5.0';
const mockIp = '127.0.0.1';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getStatus', () => {
    it('should return the status of the API with user-agent and IP', () => {
      // Arrange: Mock the service method
      const expectedResponse = {
        status: 'API is running',
        timestamp: expect.any(String),
        user: {
          userAgent: mockUserAgent,
          ip: mockIp,
        },
      };

      jest
        .spyOn(appService, 'getStatus')
        .mockImplementation(() => expectedResponse);

      // Act: Call the controller method
      const result = appController.getStatus(mockUserAgent, mockIp);

      // Assert: Verify the response
      expect(result).toEqual(expectedResponse);
    });
  });
});
