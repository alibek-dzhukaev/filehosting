import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

import { KAFKA_CONFIG } from '@config/constants';
import { KafkaConfig } from '@config/kafka.config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Consumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const kafkaConfig = this.configService.getOrThrow<KafkaConfig>('kafka');

    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      logLevel: 2, // INFO
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      idempotent: true,
      maxInFlightRequests: 5,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await Promise.all(this.consumers.map((consumer) => consumer.disconnect()));
  }

  async sendMessage(topic: string, message: Record<string, string>) {
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.id || Date.now().toString(),
          value: JSON.stringify(message),
          headers: {
            'content-type': 'application/json',
            timestamp: new Date().toISOString(),
          },
        },
      ],
    });
  }

  async subscribe(
    topic: string,
    callback: (payload: EachMessagePayload) => Promise<void>,
    options?: { fromBeginning?: boolean }
  ) {
    const kafkaConfig = this.configService.getOrThrow<KafkaConfig>(KAFKA_CONFIG);
    const consumer = this.kafka.consumer({
      groupId: kafkaConfig.consumerGroup,
      allowAutoTopicCreation: true,
    });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: options?.fromBeginning });
    await consumer.run({
      eachMessage: async (payload) => {
        try {
          await callback(payload);
        } catch (error) {
          console.error(error);
          console.error(`Error processing Kafka message:`, {
            topic,
            payload,
          });
          // Implement dead letter queue or retry logic here
        }
      },
    });

    this.consumers.push(consumer);
    return consumer;
  }
}
