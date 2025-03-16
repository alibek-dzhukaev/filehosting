import { Injectable } from '@nestjs/common';
import { Observable, Subject, interval } from 'rxjs';
import { MessageEvent } from '../common/types/sse';

@Injectable()
export class SseService {
  private eventSubject = new Subject<MessageEvent>();

  constructor() {
    interval(1000).subscribe(() => {
      this.emitEvent({
        message: 'Hello from SSE!',
        timestamp: new Date().toISOString(),
      });
    });
  }

  emitEvent(data: string | object) {
    this.eventSubject.next({ data });
  }

  getEvents(): Observable<MessageEvent> {
    return this.eventSubject.asObservable();
  }
}
