import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as Sentry from '@sentry/node';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/resources/users/entities/user.entity';
import { UsersService } from 'src/resources/users/services/users.service';

import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthenticatedUser } from '../types/authenticatedUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password' | 'hashPassword'> | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      Sentry.captureException('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthenticatedUser = {
      username: user.username,
      id: user.id,
      roles: user.roles,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    const existingUser = await this.usersService.findOneByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    return this.usersService.create({
      username,
      password,
    });
  }
}
