import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '../messages/entities/message.entity';
import { User } from '../users/entities/user.entity';

import { MessageReadStatusController } from './controllers/message-read-status.controller';
import { MessageReadStatus } from './entities/message-read-status.entity';
import { MessageReadStatusRepository } from './repositories/message-read-status.repository';
import { MessageReadStatusService } from './services/message-read-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageReadStatus, User, Message])],
  controllers: [MessageReadStatusController],
  providers: [
    MessageReadStatusRepository,
    {
      provide: 'IMessageReadStatusRepository',
      useExisting: MessageReadStatusRepository,
    },
    MessageReadStatusService,
  ],
  exports: [MessageReadStatusService],
})
export class MessageReadStatusModule {}
