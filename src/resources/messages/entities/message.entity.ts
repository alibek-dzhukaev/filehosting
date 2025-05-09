import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DirectMessageThread } from '@root/resources/direct-messages/entities/direct-message-thread.entity';

import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ default: false, name: 'is_edited' })
  isEdited: boolean;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Channel, { nullable: true })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User | null;

  @ManyToOne(() => DirectMessageThread, { nullable: true })
  @JoinColumn({ name: 'direct_thread_id' })
  directThread: DirectMessageThread | null;
}
