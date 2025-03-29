import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { MessageReadStatusService } from '@resources/message-read-status/services/message-read-status.service';

import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Message } from '../entities/message.entity';
import { IMessagesRepository } from '../repositories/repository.interface';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('IMessagesRepository')
    private readonly messagesRepository: IMessagesRepository,
    private readonly readStatusService: MessageReadStatusService
  ) {}

  async createMessage(
    userId: string,
    createMessageDto: CreateMessageDto
  ): Promise<MessageResponseDto> {
    const messageEntity = await this.messagesRepository.create(userId, createMessageDto);
    return this.toResponseDto(messageEntity);
  }

  async updateMessage(
    userId: string,
    updateMessageDto: UpdateMessageDto
  ): Promise<MessageResponseDto> {
    try {
      const message = await this.messagesRepository.update(userId, updateMessageDto);
      return this.toResponseDto(message);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    try {
      await this.messagesRepository.delete(userId, messageId);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getChannelMessages(channelId: string): Promise<MessageResponseDto[]> {
    const messages = await this.messagesRepository.findChannelMessages(channelId);
    return messages.map((message) => this.toResponseDto(message));
  }

  async getDirectMessages(userId: string, recipientId: string): Promise<MessageResponseDto[]> {
    const messages = await this.messagesRepository.findDirectMessages(userId, recipientId);
    return messages.map((message) => this.toResponseDto(message));
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messagesRepository.findById(id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async getMessageWithReadStatus(messageId: string, userId: string) {
    const message = await this.messagesRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const readStatus = await this.readStatusService.getMessageReadStatus(messageId);
    const userReadStatus = readStatus.find((status) => status.user.id === userId);

    return {
      ...message,
      readStatus,
      isRead: !!userReadStatus,
      readAt: userReadStatus?.readAt,
    };
  }

  async getDirectThreadMessages(threadId: string): Promise<MessageResponseDto[]> {
    const messages = await this.messagesRepository.findDirectThreadMessages(threadId);
    return messages.map((message) => this.toResponseDto(message));
  }

  private toResponseDto(message: any): MessageResponseDto {
    return plainToInstance(MessageResponseDto, message, {
      excludeExtraneousValues: true,
    });
  }
}
