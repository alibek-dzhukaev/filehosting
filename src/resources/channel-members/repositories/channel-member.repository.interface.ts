import { Message } from '@resources/messages/entities/message.entity';

import { Channel } from '../../channels/entities/channel.entity';
import { ChannelMember } from '../entities/channel-member.entity';
import { ChannelRole } from '../types/channel-role.type';

export interface IChannelMemberRepository {
  addMember(channelId: string, userId: string, role?: ChannelRole): Promise<ChannelMember>;
  removeMember(channelId: string, userId: string): Promise<void>;
  getMember(channelId: string, userId: string): Promise<ChannelMember | null>;
  updateMemberRole(channelId: string, userId: string, role: ChannelRole): Promise<ChannelMember>;
  getChannelMembers(channelId: string): Promise<ChannelMember[]>;
  getUserChannels(userId: string): Promise<Channel[]>;
  updateLastRead(channelId: string, userId: string, message: Message): Promise<void>;
  updateNotificationPreference(channelId: string, userId: string, enabled: boolean): Promise<void>;
}
