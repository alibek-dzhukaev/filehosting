import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfService {
    getToken(request: Request): string {
        return request.csrfToken();
    }
}