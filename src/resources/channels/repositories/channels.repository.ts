import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { Channel } from '../entities/channel.entity';

@Injectable()
export class ChannelsRepository {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const channel = this.channelsRepository.create(createChannelDto);
    await this.channelsRepository.save(channel);
    return channel;
  }

  async findAll(): Promise<Channel[]> {
    return this.channelsRepository.find();
  }

  async findOneById(id: Channel['id']): Promise<Channel | null> {
    return this.channelsRepository.findOneBy({ id });
  }

  async update(id: Channel['id'], updateChannelDto: UpdateChannelDto) {
    await this.channelsRepository.update(id, updateChannelDto);
    return this.findOneById(id);
  }

  async delete(id: Channel['id']) {
    await this.channelsRepository.softDelete({ id });
  }
}
