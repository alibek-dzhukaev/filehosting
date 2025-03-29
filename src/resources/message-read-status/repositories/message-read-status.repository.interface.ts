import { MessageReadStatus } from '../entities/message-read-status.entity';

export interface IMessageReadStatusRepository {
  markAsRead(messageId: string, userId: string): Promise<MessageReadStatus>;
  markAsDelivered(messageId: string, userId: string): Promise<MessageReadStatus>;
  getReadStatus(messageId: string): Promise<MessageReadStatus[]>;
  getUserReadMessages(userId: string, messageIds: string[]): Promise<MessageReadStatus[]>;
  getLastReadByUser(channelId: string, userId: string): Promise<MessageReadStatus | null>;
}
