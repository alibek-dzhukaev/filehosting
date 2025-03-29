import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';

import { User } from '@resources/auth/decorators/user.decorator';
import { AuthenticatedUser } from '@resources/auth/types/authenticatedUser';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from '../../messages/dto/create-message.dto';
import { DirectMessageThread } from '../entities/direct-message-thread.entity';
import { DirectMessagesService } from '../services/direct-messages.service';

@Controller('direct-messages')
@UseGuards(JwtAuthGuard)
export class DirectMessagesController {
  constructor(private readonly directMessagesService: DirectMessagesService) {}

  @Post(':recipientId')
  async createMessage(
    @User() user: AuthenticatedUser,
    @Param('recipientId') recipientId: string,
    @Body() createMessageDto: CreateMessageDto
  ) {
    return this.directMessagesService.createDirectMessage(user.id, recipientId, createMessageDto);
  }

  @Get('threads')
  async getUserThreads(@User() user: AuthenticatedUser): Promise<DirectMessageThread[]> {
    return this.directMessagesService.getUserThreads(user.id);
  }

  @Get('thread/:threadId/messages')
  async getThreadMessages(@User() user: AuthenticatedUser, @Param('threadId') threadId: string) {
    return this.directMessagesService.getThreadMessages(threadId, user.id);
  }

  @Post('thread/:threadId/archive')
  async archiveThread(
    @User() user: AuthenticatedUser,
    @Param('threadId') threadId: string
  ): Promise<void> {
    return this.directMessagesService.archiveThread(threadId, user.id);
  }

  @Post('thread/:threadId/unarchive')
  async unarchiveThread(
    @User() user: AuthenticatedUser,
    @Param('threadId') threadId: string
  ): Promise<void> {
    return this.directMessagesService.unarchiveThread(threadId, user.id);
  }

  @Post('thread/:threadId/block')
  async blockThread(
    @User() user: AuthenticatedUser,
    @Param('threadId') threadId: string
  ): Promise<void> {
    return this.directMessagesService.blockThread(threadId, user.id);
  }

  @Post('thread/:threadId/unblock')
  async unblockThread(@Param('threadId') threadId: string): Promise<void> {
    return this.directMessagesService.unblockThread(threadId);
  }
}
