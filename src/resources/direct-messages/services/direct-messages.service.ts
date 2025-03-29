import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CreateMessageDto } from '../../messages/dto/create-message.dto';
import { MessagesService } from '../../messages/services/messages.service';
import { DirectMessageThread } from '../entities/direct-message-thread.entity';
import { IDirectMessageThreadRepository } from '../repositories/direct-message-thread.repository.interface';

@Injectable()
export class DirectMessagesService {
  constructor(
    @Inject('IDirectMessageThreadRepository')
    private readonly threadRepository: IDirectMessageThreadRepository,
    private readonly messagesService: MessagesService
  ) {}

  async createDirectMessage(
    senderId: string,
    recipientId: string,
    createMessageDto: CreateMessageDto
  ) {
    const thread = await this.threadRepository.findOrCreateThread(senderId, recipientId);

    const message = await this.messagesService.createMessage(senderId, {
      ...createMessageDto,
      recipientId,
      directThreadId: thread.id,
    });

    const messageEntity = await this.messagesService.findById(message.id);
    await this.threadRepository.updateLastMessage(thread.id, messageEntity);

    return message;
  }

  async getUserThreads(userId: string): Promise<DirectMessageThread[]> {
    return this.threadRepository.findUserThreads(userId);
  }

  async getThreadMessages(threadId: string, userId: string) {
    const thread = await this.threadRepository.findThreadById(threadId);

    if (!thread || (thread.user1.id !== userId && thread.user2.id !== userId)) {
      throw new NotFoundException('Thread not found or access denied');
    }

    return this.messagesService.getDirectThreadMessages(thread.id);
  }

  async archiveThread(threadId: string, userId: string): Promise<void> {
    return this.threadRepository.archiveThread(threadId, userId);
  }

  async unarchiveThread(threadId: string, userId: string): Promise<void> {
    return this.threadRepository.unarchiveThread(threadId, userId);
  }

  async blockThread(threadId: string, blockedById: string): Promise<void> {
    return this.threadRepository.blockThread(threadId, blockedById);
  }

  async unblockThread(threadId: string): Promise<void> {
    return this.threadRepository.unblockThread(threadId);
  }
}
