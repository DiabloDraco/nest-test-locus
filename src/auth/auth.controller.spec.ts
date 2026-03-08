import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockReturnValue({ accessToken: 'mock.token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login возвращает accessToken', async () => {
    const result = await controller.login({ username: 'admin', password: 'admin123' });
    expect(result).toEqual({ accessToken: 'mock.token' });
    expect(mockAuthService.login).toHaveBeenCalledWith('admin', 'admin123');
  });
});
