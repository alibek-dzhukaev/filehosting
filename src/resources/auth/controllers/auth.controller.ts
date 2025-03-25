import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { CookieService } from '@common/cookie/services/cookie.service';

import { User } from '@resources/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@resources/auth/types/authenticatedUser';

import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const { accessToken } = await this.authService.login(loginDto);
    this.cookieService.setJwt(response, accessToken);

    response.status(HttpStatus.OK).json({ message: 'successful' });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  me(@User() user: AuthenticatedUser) {
    console.log('user', user);
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() response: Response) {
    this.cookieService.clearJwt(response);
    this.cookieService.clearCsrfTokens(response);
    response.status(HttpStatus.OK).json({ message: 'successful' });
  }
}
