import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CsrfMiddleware } from './csrf.middleware';
import {CsrfService} from "./csrf.service";

@Module({
    providers: [CsrfService],
    exports: [CsrfService]
})
export class CsrfModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CsrfMiddleware).forRoutes('*');
    }
}