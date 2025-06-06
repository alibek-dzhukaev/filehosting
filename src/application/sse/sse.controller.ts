import { Controller, Get, Header, Sse } from '@nestjs/common';

import { Observable } from 'rxjs';

import { MessageEvent } from '../common/types/sse';

import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get()
  @Sse()
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  sse(): Observable<MessageEvent> {
    return this.sseService.getEvents();
  }
}
