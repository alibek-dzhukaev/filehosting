import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Channel } from '../channels/entities/channel.entity';
import { DirectMessageThread } from '../direct-messages/entities/direct-message-thread.entity';
import { MessageReadStatusModule } from '../message-read-status/message-read-status.module';
import { User } from '../users/entities/user.entity';

import { MessagesController } from './controllers/messages.controller';
import { Message } from './entities/message.entity';
import { MessagesRepository } from './repositories/messages.repository';
import { MessagesService } from './services/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Channel, User, DirectMessageThread]),
    AuthModule,
    MessageReadStatusModule,
  ],
  controllers: [MessagesController],
  providers: [
    MessagesRepository,
    {
      provide: 'IMessagesRepository',
      useExisting: MessagesRepository,
    },
    MessagesService,
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
