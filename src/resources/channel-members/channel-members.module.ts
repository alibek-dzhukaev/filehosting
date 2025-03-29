import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Channel } from '../channels/entities/channel.entity';
import { MessagesModule } from '../messages/messages.module';
import { User } from '../users/entities/user.entity';

import { ChannelMembersController } from './controllers/channel-members.controller';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMemberRepository } from './repositories/channel-member.repository';
import { ChannelMembersService } from './services/channel-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember, Channel, User]), MessagesModule],
  controllers: [ChannelMembersController],
  providers: [
    ChannelMemberRepository,
    {
      provide: 'IChannelMemberRepository',
      useExisting: ChannelMemberRepository,
    },
    ChannelMembersService,
  ],
  exports: [ChannelMembersService],
})
export class ChannelMembersModule {}
