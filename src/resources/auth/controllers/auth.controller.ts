import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CookieService } from '@common/cookie/services/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
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

  @Post('logout')
  logout(@Res() response: Response) {
    this.cookieService.clearCookie(
      response,
      this.configService.getOrThrow('JWT_COOKIE'),
    );
    response.status(HttpStatus.OK).json({ message: 'successful' });
  }
}
