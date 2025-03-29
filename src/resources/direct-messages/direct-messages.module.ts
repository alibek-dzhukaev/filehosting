import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { User } from '../users/entities/user.entity';

import { DirectMessagesController } from './controllers/direct-messages.controller';
import { DirectMessageThread } from './entities/direct-message-thread.entity';
import { DirectMessageThreadRepository } from './repositories/direct-message-thread.repository';
import { DirectMessagesService } from './services/direct-messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([DirectMessageThread, User]), MessagesModule, AuthModule],
  controllers: [DirectMessagesController],
  providers: [
    DirectMessageThreadRepository,
    {
      provide: 'IDirectMessageThreadRepository',
      useExisting: DirectMessageThreadRepository,
    },
    DirectMessagesService,
  ],
  exports: [DirectMessagesService],
})
export class DirectMessagesModule {}
