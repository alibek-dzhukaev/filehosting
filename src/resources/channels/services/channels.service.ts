import { Injectable } from '@nestjs/common';

import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { ChannelsRepository } from '../repositories/channels.repository';

@Injectable()
export class ChannelsService {
  constructor(private readonly channelsRepository: ChannelsRepository) {}

  create(createChannelDto: CreateChannelDto) {
    return this.channelsRepository.create(createChannelDto);
  }

  findAll() {
    return this.channelsRepository.findAll();
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
