// src/message-read-status/dto/message-read-status-response.dto.ts
import { Expose, Type } from 'class-transformer';

import { MessageResponseDto } from '../../messages/dto/message-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class MessageReadStatusResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => MessageResponseDto)
  message: MessageResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  readAt: Date;

  @Expose()
  isDelivered: boolean;
}
