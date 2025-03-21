import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@resources/auth/auth.module';
import { UsersModule } from '@resources/users/users.module';

import { ChannelsController } from './controllers/channels.controller';
import { Channel } from './entities/channel.entity';
import { ChannelsRepository } from './repositories/channels.repository';
import { ChannelsService } from './services/channels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), AuthModule, UsersModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsRepository],
})
export class ChannelsModule {}
