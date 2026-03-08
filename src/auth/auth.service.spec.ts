import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('возвращает accessToken при правильных данных', () => {
      const result = service.login('admin', 'admin123');
      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('mock.jwt.token');
    });

    it('кидает UnauthorizedException при неверном пароле', () => {
      expect(() => service.login('admin', 'wrongpassword')).toThrow(
        UnauthorizedException,
      );
    });

    it('кидает UnauthorizedException при несуществующем пользователе', () => {
      expect(() => service.login('nobody', 'pass')).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('возвращает пользователя без пароля при правильных данных', () => {
      const user = service.validateUser('user', 'user123');
      expect(user).not.toBeNull();
      expect(user).not.toHaveProperty('password');
      expect(user?.username).toBe('user');
    });

    it('возвращает null при неверных данных', () => {
      const user = service.validateUser('admin', 'wrong');
      expect(user).toBeNull();
    });
  });
});
