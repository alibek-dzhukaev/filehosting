import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Message } from '../entities/message.entity';

import { IMessagesRepository } from './repository.interface';

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(userId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const sender = await this.userRepository.findOneBy({ id: userId });
    if (!sender) {
      throw new Error('User not found');
    }

    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender,
    });

    if (createMessageDto.channelId) {
      const channel = await this.channelRepository.findOneBy({ id: createMessageDto.channelId });
      if (!channel) {
        throw new Error('Channel not found');
      }
      message.channel = channel;
    } else if (createMessageDto.recipientId) {
      const recipient = await this.userRepository.findOneBy({ id: createMessageDto.recipientId });
      if (!recipient) {
        throw new Error('Recipient not found');
      }
      message.recipient = recipient;
    } else {
      throw new Error('Either channelId or recipientId must be provided');
    }

    return this.messageRepository.save(message);
  }

  async update(userId: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: updateMessageDto.messageId, sender: { id: userId } },
    });

    if (!message) {
      throw new Error('Message not found or you are not the sender');
    }

    message.content = updateMessageDto.content;
    message.isEdited = true;
    return this.messageRepository.save(message);
  }

  async delete(userId: string, messageId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, sender: { id: userId } },
    });

    if (!message) {
      throw new Error('Message not found or you are not the sender');
    }

    message.isDeleted = true;
    await this.messageRepository.save(message);
  }

  async findChannelMessages(channelId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { channel: { id: channelId }, isDeleted: false },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async findDirectMessages(userId: string, recipientId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId }, recipient: { id: recipientId }, isDeleted: false },
        { sender: { id: recipientId }, recipient: { id: userId }, isDeleted: false },
      ],
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<Message | null> {
    return this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'channel', 'recipient'],
    });
  }
}
