import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelsController } from './controllers/channels.controller';
import { Channel } from './entities/channel.entity';
import { ChannelsRepository } from './repositories/channels.repository';
import { ChannelsService } from './services/channels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsRepository],
})
export class ChannelsModule {}
