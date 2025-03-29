import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v4 as uuidv4 } from 'uuid';

import { KAFKA_CONFIG } from '@config/constants';
import { KafkaConfig } from '@config/kafka.config';

import { KafkaService } from '@infrastructure/messaging/kafka.service';

@Injectable()
export class MessageProducer {
  private readonly topics: KafkaConfig['topics'];

  constructor(
    private kafkaService: KafkaService,
    private configService: ConfigService
  ) {
    this.topics = this.configService.getOrThrow<KafkaConfig>(KAFKA_CONFIG).topics;
  }

  async sendChannelMessage(channelId: string, message: string, userId: string) {
    await this.kafkaService.sendMessage(this.topics.messages, {
      id: uuidv4(),
      type: 'channel',
      channelId,
      userId,
      content: message,
      timestamp: new Date().toISOString(),
    });
  }

  async sendDirectMessage(senderId: string, receiverId: string, message: string) {
    await this.kafkaService.sendMessage(this.topics.messages, {
      id: uuidv4(),
      type: 'direct',
      senderId,
      receiverId,
      content: message,
      timestamp: new Date().toISOString(),
    });
  }

  async notifyFileUpload(userId: string, fileInfo: string) {
    await this.kafkaService.sendMessage(this.topics.files, {
      id: uuidv4(),
      userId,
      fileInfo,
      timestamp: new Date().toISOString(),
    });
  }
}
