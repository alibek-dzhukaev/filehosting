import { Controller, Post, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CookieService } from '../../../cookie/services/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
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
    response.clearCookie(this.configService.getOrThrow('JWT_COOKIE'), {
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') !== 'production',
      sameSite: 'strict',
    });
    return { message: 'successful' };
  }
}
