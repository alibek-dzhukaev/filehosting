import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
    ) {
    }
    private readonly csrfProtection = csurf({
        cookie: {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict'
        }
    });

    private readonly excludedRoutes: string[] = [
        '/api/auth/login',
        '/api/auth/register',
    ];

    use(request: Request, response: Response, next: NextFunction) {
        if (this.isRouteExcluded(request)) {
            return next();
        }

        // Apply CSRF protection
        cookieParser()(request, response, () => {
            this.csrfProtection(request, response, next);
        });
    }

    private isRouteExcluded(req: Request): boolean {
        return this.excludedRoutes.some((route) => req.path.startsWith(route));
    }
}