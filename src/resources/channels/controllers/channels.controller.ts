import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '@app/resources/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@app/resources/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@app/resources/auth/types/authenticatedUser';

import { TransactionInterceptor } from '@common/interceptors/transaction.interceptor';
import { Role } from '@common/roles/constants/roles.constant';
import { Roles } from '@common/roles/decorators/roles.decorator';
import { RolesGuard } from '@common/roles/guards/roles.guard';

import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { ChannelsService } from '../services/channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createChannelDto: CreateChannelDto, @User() user: AuthenticatedUser) {
    return this.channelsService.create(createChannelDto, user.id);
  }

  @Get()
  findAll(@User() user: AuthenticatedUser) {
    return this.channelsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(TransactionInterceptor)
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @UseInterceptors(TransactionInterceptor)
  remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }
}
