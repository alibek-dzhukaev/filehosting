import { Injectable } from '@nestjs/common';

import { User } from '@app/resources/users/entities/user.entity';
import { UsersService } from '@app/resources/users/services/users.service';

import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { ChannelsRepository } from '../repositories/channels.repository';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelsRepository: ChannelsRepository,
    private readonly usersService: UsersService
  ) {}

  async create(createChannelDto: CreateChannelDto, creatorId: User['id']) {
    const adminIds = Array.isArray(createChannelDto.adminIds)
      ? [...createChannelDto.adminIds, creatorId]
      : [creatorId];
    const admins = await this.usersService.findByIds(adminIds);

    return this.channelsRepository.create(createChannelDto, admins);
  }

  findAll(requesterId: User['id']) {
    return this.channelsRepository.findAll({
      requesterId,
    });
  }

  findOne(id: string) {
    return this.channelsRepository.findOneById(id);
  }

  update(id: string, updateChannelDto: UpdateChannelDto) {
    return this.channelsRepository.update(id, updateChannelDto);
  }

  remove(id: string) {
    return this.channelsRepository.delete(id);
  }
}
