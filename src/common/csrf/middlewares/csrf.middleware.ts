import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { doubleCsrf } from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';

/**
 * CSRF Middleware
 *
 * This middleware handles CSRF protection for all routes except the login endpoint.
 * It generates a CSRF token and attaches it to the response for use by the client.
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CsrfMiddleware.name);

  constructor(private readonly configService: ConfigService) {}

  private readonly csrfUtilities = doubleCsrf({
    getSecret: () => this.configService.getOrThrow('CSRF_SECRET'),
    cookieName: this.configService.getOrThrow('CSRF_TOKEN'),
    cookieOptions: {
      httpOnly: true,
      secure: this.configService.get('NOD_ENV') === 'production',
      sameSite: 'strict',
    },
  });

  private readonly excludedRoutes: string[] = ['/api/auth/login', '/api/auth/register'];

  use(request: Request, response: Response, next: NextFunction): void {
    // Generate a CSRF token and attach it to the response locals
    response.locals.csrfToken = this.csrfUtilities.generateToken(request, response);

    // Skip CSRF protection for the login endpoint
    if (this.isRouteExcluded(request)) {
      this.logger.debug('CSRF protection skipped for login endpoint');
      return next();
    }

    // Apply CSRF protection to all other routes
    this.csrfUtilities.doubleCsrfProtection(request, response, next);
  }

  private isRouteExcluded(request: Request): boolean {
    return this.excludedRoutes.some((route) => request.baseUrl.startsWith(route));
  }
}
