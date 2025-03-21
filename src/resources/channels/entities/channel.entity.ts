import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { ChannelType } from '../types/ChannelType';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    default: ChannelType.PUBLIC,
    type: 'enum',
    enum: ChannelType,
  })
  type: ChannelType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'create_at',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @Column({ default: false, name: 'is_archived' })
  isArchived: boolean;

  @Column({ default: false, name: 'is_readonly' })
  isReadonly: boolean;

  @Column({ nullable: true, name: 'invite_link' })
  inviteLink: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];
}
