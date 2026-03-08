import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';

interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
}

const USERS: User[] = [
  { 
    id: 1, 
    username: 'admin', 
    password: 'admin123', 
    role: Role.ADMIN 
  },
  { 
    id: 2, 
    username: 'user', 
    password: 'user123', 
    role: 
    Role.USER 
  },
  { 
    id: 3, 
    username: 'restricted', 
    password: 'restricted123', 
    role: Role.RESTRICTED 
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(username: string, password: string): Omit<User, 'password'> | null {
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (!user) return null;
    const { password: _pw, ...result } = user;
    return result;
  }

  login(username: string, password: string): { accessToken: string } {
    const user = this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  findById(id: number): Omit<User, 'password'> | null {
    const user = USERS.find((u) => u.id === id);
    if (!user) return null;
    const { password: _pw, ...result } = user;
    return result;
  }
}
