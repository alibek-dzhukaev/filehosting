import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies: Record<string, string> = request.cookies;

    const token = cookies[this.configService.getOrThrow<string>('JWT_COOKIE')];

    if (!token) {
      throw new UnauthorizedException('no token provided');
    }

    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('invalid token');
    }
  }
}
