import { Message } from '@root/resources/messages/entities/message.entity';

import { DirectMessageThread } from '../entities/direct-message-thread.entity';

export interface IDirectMessageThreadRepository {
  findOrCreateThread(user1Id: string, user2Id: string): Promise<DirectMessageThread>;
  findUserThreads(userId: string): Promise<DirectMessageThread[]>;
  findThreadById(threadId: string): Promise<DirectMessageThread | null>;
  findThreadBetweenUsers(user1Id: string, user2Id: string): Promise<DirectMessageThread | null>;
  updateLastMessage(threadId: string, message: Message): Promise<void>;
  archiveThread(threadId: string, userId: string): Promise<void>;
  unarchiveThread(threadId: string, userId: string): Promise<void>;
  blockThread(threadId: string, blockedById: string): Promise<void>;
  unblockThread(threadId: string): Promise<void>;
}
