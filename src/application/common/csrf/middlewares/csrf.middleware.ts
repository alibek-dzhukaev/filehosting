import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { doubleCsrf } from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';

import { CookieService } from '@application/common/cookie/services/cookie.service';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CsrfMiddleware.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService
  ) {}

  private readonly csrfUtilities = doubleCsrf({
    getSecret: () => this.configService.getOrThrow('CSRF_SECRET'),
    cookieName: this.configService.getOrThrow('CSRF_PRIVATE_TOKEN'),
    cookieOptions: {
      httpOnly: true,
      secure: this.configService.get('NOD_ENV') === 'production',
      sameSite: 'strict',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  });

  private readonly excludedRoutes: string[] = ['/api/auth/login', '/api/auth/register'];

  use(request: Request, response: Response, next: NextFunction): void {
    response.locals.csrfToken = this.csrfUtilities.generateToken(request, response);

    if (this.isRouteExcluded(request)) {
      this.logger.debug('CSRF protection skipped for login endpoint');
      return next();
    }

    this.cookieService.setPublicCsrf(response, response.locals.csrfToken);

    this.csrfUtilities.doubleCsrfProtection(request, response, next);
  }

  private isRouteExcluded(request: Request): boolean {
    return this.excludedRoutes.some((route) => request.baseUrl.startsWith(route));
  }
}
