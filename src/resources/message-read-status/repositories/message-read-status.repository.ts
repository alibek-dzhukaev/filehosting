import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { Message } from '../../messages/entities/message.entity';
import { User } from '../../users/entities/user.entity';
import { MessageReadStatus } from '../entities/message-read-status.entity';

import { IMessageReadStatusRepository } from './message-read-status.repository.interface';

@Injectable()
export class MessageReadStatusRepository implements IMessageReadStatusRepository {
  constructor(
    @InjectRepository(MessageReadStatus)
    private readonly readStatusRepository: Repository<MessageReadStatus>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async markAsRead(messageId: string, userId: string): Promise<MessageReadStatus> {
    let status = await this.readStatusRepository.findOne({
      where: { message: { id: messageId }, user: { id: userId } },
    });

    if (!status) {
      const message = await this.messageRepository.findOneBy({ id: messageId });
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!message || !user) {
        throw new Error('Message or User not found');
      }

      status = this.readStatusRepository.create({ message, user });
    }

    return this.readStatusRepository.save(status);
  }

  async markAsDelivered(messageId: string, userId: string): Promise<MessageReadStatus> {
    let status = await this.readStatusRepository.findOne({
      where: { message: { id: messageId }, user: { id: userId } },
    });

    if (!status) {
      const message = await this.messageRepository.findOneBy({ id: messageId });
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!message || !user) {
        throw new Error('Message or User not found');
      }

      status = this.readStatusRepository.create({
        message,
        user,
        isDelivered: true,
      });
    } else {
      status.isDelivered = true;
    }

    return this.readStatusRepository.save(status);
  }

  async getReadStatus(messageId: string): Promise<MessageReadStatus[]> {
    return this.readStatusRepository.find({
      where: { message: { id: messageId } },
      relations: ['user'],
    });
  }

  async getUserReadMessages(userId: string, messageIds: string[]): Promise<MessageReadStatus[]> {
    return this.readStatusRepository.find({
      where: {
        user: { id: userId },
        message: { id: In(messageIds) },
      },
    });
  }

  async getLastReadByUser(channelId: string, userId: string): Promise<MessageReadStatus | null> {
    return this.readStatusRepository
      .createQueryBuilder('status')
      .innerJoin('status.message', 'message')
      .where('message.channel_id = :channelId', { channelId })
      .andWhere('status.user_id = :userId', { userId })
      .orderBy('message.created_at', 'DESC')
      .getOne();
  }
}
