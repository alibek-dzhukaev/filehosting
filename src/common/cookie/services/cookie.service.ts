import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CookieOptions, Request, Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setJwt(response: Response, accessToken: string) {
    this.setCookie(response, this.configService.getOrThrow<string>('JWT_COOKIE'), accessToken, {
      maxAge: this.configService.get<number>('JWT_EXPIRE'),
    });
  }

  clearJwt(response: Response) {
    this.clearCookie(response, this.configService.getOrThrow('JWT_COOKIE'));
  }

  setPublicCsrf(response: Response, csrfToken: string) {
    this.setCookie(
      response,
      this.configService.getOrThrow<string>('CSRF_PUBLIC_TOKEN'),
      csrfToken,
      { httpOnly: false }
    );
  }

  clearCsrfTokens(response: Response) {
    this.clearCookie(response, this.configService.getOrThrow('CSRF_PRIVATE_TOKEN'));
    this.clearCookie(response, this.configService.getOrThrow('CSRF_PUBLIC_TOKEN'));
  }

  private clearCookie(response: Response, name: string): void {
    response.clearCookie(name, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
  }

  private getCookie(request: Request, name: string): string | undefined {
    const cookies: Record<string, string> = request.cookies;
    return cookies[name];
  }

  private setCookie(
    response: Response,
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    const defaultOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    };
    const cookieOptions = { ...defaultOptions, ...options };
    response.cookie(name, value, cookieOptions);
  }
}
