// src/channel-members/dto/channel-member-response.dto.ts
import { Expose, Type } from 'class-transformer';

import { ChannelResponseDto } from '../../channels/dto/channel-response.dto';
import { MessageResponseDto } from '../../messages/dto/message-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ChannelMemberResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => ChannelResponseDto)
  channel: ChannelResponseDto;

  @Expose()
  role: string;

  @Expose()
  joinedAt: Date;

  @Expose()
  notificationsEnabled: boolean;

  @Expose()
  @Type(() => MessageResponseDto)
  lastReadMessage?: MessageResponseDto;
}
