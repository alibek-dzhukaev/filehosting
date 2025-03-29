import { Controller, Get, Post, Param } from '@nestjs/common';

import { User } from '@root/resources/auth/decorators/user.decorator';
import { AuthenticatedUser } from '@root/resources/auth/types/authenticatedUser';

import { MessageReadStatusService } from '../services/message-read-status.service';

@Controller('messages')
export class MessageReadStatusController {
  constructor(private readonly readStatusService: MessageReadStatusService) {}

  @Post(':messageId/read')
  async markAsRead(@User() user: AuthenticatedUser, @Param('messageId') messageId: string) {
    return this.readStatusService.markMessageAsRead(messageId, user.id);
  }

  @Post(':messageId/delivered')
  async markAsDelivered(@User() user: AuthenticatedUser, @Param('messageId') messageId: string) {
    return this.readStatusService.markMessageAsDelivered(messageId, user.id);
  }

  @Get(':messageId/read-status')
  async getReadStatus(@Param('messageId') messageId: string) {
    return this.readStatusService.getMessageReadStatus(messageId);
  }
}
