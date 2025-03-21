import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { User } from '@app/resources/users/entities/user.entity';

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

  @ManyToMany(() => User, (user) => user.channels)
  members: User[];

  @ManyToMany(() => User, (user) => user.adminChannels, { cascade: ['insert', 'update'] })
  admins: User[];
}
