// src/message-read-status/entities/message-read-status.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { Message } from '../../messages/entities/message.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'message_read_status' })
@Index(['message', 'user'], { unique: true }) // Ensure one read status per user per message
export class MessageReadStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'read_at' })
  readAt: Date;

  @Column({ default: false, name: 'is_delivered' })
  isDelivered: boolean;
}
