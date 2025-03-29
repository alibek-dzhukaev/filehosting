import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import kafkaConfig from '@config/kafka.config';

import { KafkaService } from './kafka.service';

@Module({
  imports: [ConfigModule.forFeature(kafkaConfig)],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
