import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { User } from '@resources/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@resources/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@resources/auth/types/authenticatedUser';

import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { MessagesService } from '../services/messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(@User() user: AuthenticatedUser, @Body() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.createMessage(user.id, createMessageDto);
    return plainToInstance(MessageResponseDto, message, { excludeExtraneousValues: true });
  }

  @Put()
  async updateMessage(@User() user: AuthenticatedUser, @Body() updateMessageDto: UpdateMessageDto) {
    const message = await this.messagesService.updateMessage(user.id, updateMessageDto);
    return plainToInstance(MessageResponseDto, message, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  async deleteMessage(@User() user: AuthenticatedUser, @Param('id') id: string) {
    await this.messagesService.deleteMessage(user.id, id);
    return { success: true };
  }

  @Get('channel/:channelId')
  async getChannelMessages(@Param('channelId') channelId: string) {
    const messages = await this.messagesService.getChannelMessages(channelId);
    return plainToInstance(MessageResponseDto, messages, { excludeExtraneousValues: true });
  }

  @Get('direct/:recipientId')
  async getDirectMessages(
    @User() user: AuthenticatedUser,
    @Param('recipientId') recipientId: string
  ) {
    const messages = await this.messagesService.getDirectMessages(user.id, recipientId);
    return plainToInstance(MessageResponseDto, messages, { excludeExtraneousValues: true });
  }
}
