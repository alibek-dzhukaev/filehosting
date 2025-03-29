// src/direct-messages/dto/direct-message-thread-response.dto.ts
import { Expose, Type } from 'class-transformer';

import { MessageResponseDto } from '../../messages/dto/message-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class DirectMessageThreadResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserResponseDto)
  user1: UserResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  user2: UserResponseDto;

  @Expose()
  @Type(() => MessageResponseDto)
  lastMessage?: MessageResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
