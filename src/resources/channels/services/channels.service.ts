import { Injectable } from '@nestjs/common';

import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { ChannelsRepository } from '../repositories/channels.repository';

@Injectable()
export class ChannelsService {
  constructor(private readonly channelsReposiroty: ChannelsRepository) {}

  create(createChannelDto: CreateChannelDto) {
    return this.channelsReposiroty.create(createChannelDto);
  }

  findAll() {
    return this.channelsReposiroty.findAll();
  }

  findOne(id: string) {
    return this.channelsReposiroty.findOneById(id);
  }

  update(id: string, updateChannelDto: UpdateChannelDto) {
    return this.channelsReposiroty.update(id, updateChannelDto);
  }

  remove(id: string) {
    return this.channelsReposiroty.delete(id);
  }
}
