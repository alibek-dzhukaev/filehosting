import { Controller, Get, Post, Delete, Param, Body, ForbiddenException } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { User } from '@resources/auth/decorators/user.decorator';
import { AuthenticatedUser } from '@resources/auth/types/authenticatedUser';

import { ChannelMemberResponseDto } from '../dto/channel-member-response.dto';
import { ChannelMembersService } from '../services/channel-members.service';
import { ChannelRole } from '../types/channel-role.type';

@Controller('channels/:channelId/members')
export class ChannelMembersController {
  constructor(private readonly channelMembersService: ChannelMembersService) {}

  @Post()
  async joinChannel(@User() user: AuthenticatedUser, @Param('channelId') channelId: string) {
    const member = await this.channelMembersService.joinChannel(channelId, user.id);
    return plainToInstance(ChannelMemberResponseDto, member);
  }

  @Delete(':userId')
  async leaveChannel(
    @User() user: AuthenticatedUser,
    @Param('channelId') channelId: string,
    @Param('userId') userId: string
  ) {
    if (user.id !== userId) {
      throw new ForbiddenException('Cannot remove other users');
    }
    await this.channelMembersService.leaveChannel(channelId, userId);
    return { success: true };
  }

  @Post(':userId/role')
  async changeRole(
    @User() user: AuthenticatedUser,
    @Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Body('role') role: ChannelRole
  ) {
    const member = await this.channelMembersService.changeMemberRole(
      channelId,
      user.id,
      userId,
      role
    );
    return plainToInstance(ChannelMemberResponseDto, member);
  }

  @Get()
  async getChannelMembers(@Param('channelId') channelId: string) {
    const members = await this.channelMembersService.getChannelMembers(channelId);
    return plainToInstance(ChannelMemberResponseDto, members);
  }

  @Post('last-read/:messageId')
  async updateLastRead(
    @User() user: AuthenticatedUser,
    @Param('channelId') channelId: string,
    @Param('messageId') messageId: string
  ) {
    await this.channelMembersService.updateLastRead(channelId, user.id, messageId);
    return { success: true };
  }
}
