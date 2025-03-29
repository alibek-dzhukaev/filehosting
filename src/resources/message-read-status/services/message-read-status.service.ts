// src/message-read-status/services/message-read-status.service.ts
import { Inject, Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { MessageReadStatusResponseDto } from '../dto/message-read-status-response.dto';
import { IMessageReadStatusRepository } from '../repositories/message-read-status.repository.interface';

@Injectable()
export class MessageReadStatusService {
  constructor(
    @Inject('IMessageReadStatusRepository')
    private readonly readStatusRepository: IMessageReadStatusRepository
  ) {}

  async markMessageAsRead(
    messageId: string,
    userId: string
  ): Promise<MessageReadStatusResponseDto> {
    const status = await this.readStatusRepository.markAsRead(messageId, userId);
    return this.toResponseDto(status);
  }

  async markMessageAsDelivered(
    messageId: string,
    userId: string
  ): Promise<MessageReadStatusResponseDto> {
    const status = await this.readStatusRepository.markAsDelivered(messageId, userId);
    return this.toResponseDto(status);
  }

  async getMessageReadStatus(messageId: string): Promise<MessageReadStatusResponseDto[]> {
    const statuses = await this.readStatusRepository.getReadStatus(messageId);
    return statuses.map((status) => this.toResponseDto(status));
  }

  private toResponseDto(status: any): MessageReadStatusResponseDto {
    return plainToInstance(MessageReadStatusResponseDto, status, {
      excludeExtraneousValues: true,
    });
  }
}
