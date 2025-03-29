import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KAFKA_CONFIG } from '@config/constants';
import { KafkaConfig } from '@config/kafka.config';

import { KafkaService } from '@infrastructure/messaging/kafka.service';

@Injectable()
export class MessageConsumer implements OnModuleInit {
  private readonly topics: KafkaConfig['topics'];

  constructor(
    private kafkaService: KafkaService,
    private configService: ConfigService
  ) {
    this.topics = this.configService.getOrThrow<KafkaConfig>(KAFKA_CONFIG).topics;
  }

  async onModuleInit() {
    await this.setupConsumers();
  }

  private async setupConsumers() {
    // Message consumer
    await this.kafkaService.subscribe(this.topics.messages, async ({ message }) => {
      const msg: unknown = JSON.parse(message.value?.toString() ?? '');
      console.log(msg);
      // todo: send message when chatService will be ready

      // if (msg.type === 'channel') {
      //   await this.chatService.processChannelMessage(msg);
      // } else if (msg.type === 'direct') {
      //   await this.chatService.processDirectMessage(msg);
      // }

      await Promise.resolve({});
    });

    // File upload consumer
    await this.kafkaService.subscribe(this.topics.files, async ({ message }) => {
      const fileInfo: unknown = JSON.parse(message.value?.toString() ?? '');
      console.log(fileInfo);
      // todo: send fileInfo when notificationService is ready;

      // await this.notificationService.notifyFileUpload(
      //   fileInfo.userId,
      //   fileInfo.fileInfo,
      // );
      await Promise.resolve({});
    });
  }
}
