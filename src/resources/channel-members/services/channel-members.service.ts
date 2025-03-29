import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';

import { Channel } from '@resources/channels/entities/channel.entity';
import { MessagesService } from '@resources/messages/services/messages.service';

import { ChannelMember } from '../entities/channel-member.entity';
import { IChannelMemberRepository } from '../repositories/channel-member.repository.interface';
import { ChannelRole } from '../types/channel-role.type';

@Injectable()
export class ChannelMembersService {
  constructor(
    @Inject('IChannelMemberRepository')
    private readonly channelMemberRepository: IChannelMemberRepository,
    private readonly messageService: MessagesService
  ) {}

  async joinChannel(channelId: string, userId: string): Promise<ChannelMember> {
    return this.channelMemberRepository.addMember(channelId, userId);
  }

  async leaveChannel(channelId: string, userId: string): Promise<void> {
    return this.channelMemberRepository.removeMember(channelId, userId);
  }

  async changeMemberRole(
    channelId: string,
    requesterId: string,
    targetUserId: string,
    newRole: ChannelRole
  ): Promise<ChannelMember> {
    const requester = await this.channelMemberRepository.getMember(channelId, requesterId);
    if (!requester) throw new NotFoundException('Requester not found in channel');

    const target = await this.channelMemberRepository.getMember(channelId, targetUserId);
    if (!target) throw new NotFoundException('Target user not found in channel');

    // Verify requester has permission to change roles
    if (!this.canChangeRole(requester.role, target.role, newRole)) {
      throw new ForbiddenException('Insufficient permissions to change role');
    }

    return this.channelMemberRepository.updateMemberRole(channelId, targetUserId, newRole);
  }

  async getChannelMembers(channelId: string): Promise<ChannelMember[]> {
    return this.channelMemberRepository.getChannelMembers(channelId);
  }

  async getUserChannels(userId: string): Promise<Channel[]> {
    return this.channelMemberRepository.getUserChannels(userId);
  }

  async updateLastRead(channelId: string, userId: string, messageId: string): Promise<void> {
    const message = await this.messageService.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return this.channelMemberRepository.updateLastRead(channelId, userId, message);
  }

  private canChangeRole(
    requesterRole: ChannelRole,
    targetRole: ChannelRole,
    newRole: ChannelRole
  ): boolean {
    const roleHierarchy = [
      ChannelRole.OWNER,
      ChannelRole.ADMIN,
      ChannelRole.MODERATOR,
      ChannelRole.MEMBER,
      ChannelRole.GUEST,
    ];

    // Only owners can assign owner role
    if (newRole === ChannelRole.OWNER) return requesterRole === ChannelRole.OWNER;

    // Can't modify users with higher or equal role
    if (roleHierarchy.indexOf(targetRole) <= roleHierarchy.indexOf(requesterRole)) {
      return false;
    }

    // Can only assign roles below your own
    return roleHierarchy.indexOf(newRole) >= roleHierarchy.indexOf(requesterRole);
  }
}
