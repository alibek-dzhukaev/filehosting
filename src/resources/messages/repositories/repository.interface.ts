import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Message } from '../entities/message.entity';

export interface IMessagesRepository {
  create(userId: string, createMessageDto: CreateMessageDto): Promise<Message>;
  update(userId: string, updateMessageDto: UpdateMessageDto): Promise<Message>;
  delete(userId: string, messageId: string): Promise<void>;
  findChannelMessages(channelId: string): Promise<Message[]>;
  findDirectMessages(userId: string, recipientId: string): Promise<Message[]>;
  findDirectThreadMessages(threadId: string): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
}
