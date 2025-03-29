import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Message } from '@root/resources/messages/entities/message.entity';

import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';
import { ChannelMember } from '../entities/channel-member.entity';
import { ChannelRole } from '../types/channel-role.type';

import { IChannelMemberRepository } from './channel-member.repository.interface';

@Injectable()
export class ChannelMemberRepository implements IChannelMemberRepository {
  constructor(
    @InjectRepository(ChannelMember)
    private readonly channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async addMember(
    channelId: string,
    userId: string,
    role: ChannelRole = ChannelRole.MEMBER
  ): Promise<ChannelMember> {
    const channel = await this.channelRepository.findOneBy({ id: channelId });
    if (!channel) throw new NotFoundException('Channel not found');

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const existingMember = await this.channelMemberRepository.findOneBy({
      channel: { id: channelId },
      user: { id: userId },
    });
    if (existingMember) return existingMember;

    const member = this.channelMemberRepository.create({
      channel,
      user,
      role,
    });

    return this.channelMemberRepository.save(member);
  }

  async removeMember(channelId: string, userId: string): Promise<void> {
    await this.channelMemberRepository.delete({
      channel: { id: channelId },
      user: { id: userId },
    });
  }

  async getMember(channelId: string, userId: string): Promise<ChannelMember | null> {
    return this.channelMemberRepository.findOne({
      where: { channel: { id: channelId }, user: { id: userId } },
      relations: ['user', 'channel'],
    });
  }

  async updateMemberRole(
    channelId: string,
    userId: string,
    role: ChannelRole
  ): Promise<ChannelMember> {
    const member = await this.getMember(channelId, userId);
    if (!member) throw new NotFoundException('Channel member not found');

    member.role = role;
    return this.channelMemberRepository.save(member);
  }

  async getChannelMembers(channelId: string): Promise<ChannelMember[]> {
    return this.channelMemberRepository.find({
      where: { channel: { id: channelId } },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  async getUserChannels(userId: string): Promise<Channel[]> {
    const members = await this.channelMemberRepository.find({
      where: { user: { id: userId } },
      relations: ['channel'],
    });
    return members.map((member) => member.channel);
  }

  async updateLastRead(channelId: string, userId: string, message: Message): Promise<void> {
    await this.channelMemberRepository.update(
      { channel: { id: channelId }, user: { id: userId } },
      { lastReadMessage: message }
    );
  }

  async updateNotificationPreference(
    channelId: string,
    userId: string,
    enabled: boolean
  ): Promise<void> {
    await this.channelMemberRepository.update(
      { channel: { id: channelId }, user: { id: userId } },
      { notificationsEnabled: enabled }
    );
  }
}
