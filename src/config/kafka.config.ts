import { registerAs } from '@nestjs/config';

import { KAFKA_CONFIG } from './constants';

export interface KafkaConfig {
  brokers: string[];
  clientId: string;
  consumerGroup: string;
  topics: {
    messages: string;
    files: string;
    notifications: string;
  };
}

export default registerAs(
  KAFKA_CONFIG,
  (): KafkaConfig => ({
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'chat-service',
    consumerGroup: process.env.KAFKA_CONSUMER_GROUP || 'chat-service-group',
    topics: {
      messages: 'chat-messages',
      files: 'file-uploads',
      notifications: 'user-notifications',
    },
  })
);
