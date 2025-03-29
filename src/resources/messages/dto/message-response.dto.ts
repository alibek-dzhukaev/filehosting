import { Expose, Type } from 'class-transformer';

import { UserResponseDto } from '@resources/users/dto/user-response.dto';

import { ChannelResponseDto } from '../../channels/dto/channel-response.dto';
import { DirectMessageThreadResponseDto } from '../../direct-messages/dto/direct-message-thread-response.dto';

export class MessageResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => UserResponseDto)
  sender: UserResponseDto;

  @Expose()
  @Type(() => ChannelResponseDto)
  channel?: ChannelResponseDto;

  @Expose()
  @Type(() => DirectMessageThreadResponseDto)
  directThread?: DirectMessageThreadResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  isEdited: boolean;

  @Expose()
  isDeleted: boolean;
}
