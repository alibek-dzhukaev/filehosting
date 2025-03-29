import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Message } from '../../messages/entities/message.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'direct_message_thread' })
export class DirectMessageThread {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: Message | null;

  @OneToMany(() => Message, (message) => message.directThread)
  messages: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: false, name: 'is_archived_user1' })
  isArchivedUser1: boolean;

  @Column({ default: false, name: 'is_archived_user2' })
  isArchivedUser2: boolean;

  @Column({ default: false, name: 'is_blocked' })
  isBlocked: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'blocked_by_id' })
  blockedBy: User | null;
}
