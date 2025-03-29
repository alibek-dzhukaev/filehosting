import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Message } from '@root/resources/messages/entities/message.entity';

import { User } from '../../users/entities/user.entity';
import { DirectMessageThread } from '../entities/direct-message-thread.entity';

import { IDirectMessageThreadRepository } from './direct-message-thread.repository.interface';

@Injectable()
export class DirectMessageThreadRepository implements IDirectMessageThreadRepository {
  constructor(
    @InjectRepository(DirectMessageThread)
    private readonly threadRepository: Repository<DirectMessageThread>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOrCreateThread(user1Id: string, user2Id: string): Promise<DirectMessageThread> {
    // Sort user IDs to ensure thread uniqueness regardless of order
    const [id1, id2] = [user1Id, user2Id].sort();

    let thread = await this.threadRepository.findOne({
      where: [{ user1: { id: id1 }, user2: { id: id2 } }],
      relations: ['user1', 'user2'],
    });

    if (!thread) {
      const user1 = await this.userRepository.findOneBy({ id: id1 });
      const user2 = await this.userRepository.findOneBy({ id: id2 });

      if (!user1 || !user2) {
        throw new NotFoundException('One or both users not found');
      }

      thread = this.threadRepository.create({
        user1,
        user2,
      });

      thread = await this.threadRepository.save(thread);
    }

    return thread;
  }

  async findUserThreads(userId: string): Promise<DirectMessageThread[]> {
    return this.threadRepository.find({
      where: [
        { user1: { id: userId }, isArchivedUser1: false },
        { user2: { id: userId }, isArchivedUser2: false },
      ],
      relations: ['user1', 'user2'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findThreadById(threadId: string): Promise<DirectMessageThread | null> {
    return this.threadRepository.findOne({
      where: { id: threadId },
      relations: ['user1', 'user2'],
    });
  }

  async findThreadBetweenUsers(
    user1Id: string,
    user2Id: string
  ): Promise<DirectMessageThread | null> {
    const [id1, id2] = [user1Id, user2Id].sort();
    return this.threadRepository.findOne({
      where: [{ user1: { id: id1 }, user2: { id: id2 } }],
      relations: ['user1', 'user2'],
    });
  }

  async updateLastMessage(threadId: string, message: Message): Promise<void> {
    await this.threadRepository.update(threadId, {
      lastMessage: message,
      updatedAt: new Date(),
    });
  }

  async archiveThread(threadId: string, userId: string): Promise<void> {
    const thread = await this.threadRepository.findOne({
      where: { id: threadId },
      relations: ['user1', 'user2'],
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (thread.user1.id === userId) {
      await this.threadRepository.update(threadId, { isArchivedUser1: true });
    } else if (thread.user2.id === userId) {
      await this.threadRepository.update(threadId, { isArchivedUser2: true });
    } else {
      throw new NotFoundException('User not part of this thread');
    }
  }

  async unarchiveThread(threadId: string, userId: string): Promise<void> {
    const thread = await this.threadRepository.findOne({
      where: { id: threadId },
      relations: ['user1', 'user2'],
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (thread.user1.id === userId) {
      await this.threadRepository.update(threadId, { isArchivedUser1: false });
    } else if (thread.user2.id === userId) {
      await this.threadRepository.update(threadId, { isArchivedUser2: false });
    } else {
      throw new NotFoundException('User not part of this thread');
    }
  }

  async blockThread(threadId: string, blockedById: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: blockedById });
    await this.threadRepository.update(threadId, {
      isBlocked: true,
      blockedBy: user,
    });
  }

  async unblockThread(threadId: string): Promise<void> {
    await this.threadRepository.update(threadId, {
      isBlocked: false,
      blockedBy: null,
    });
  }
}
