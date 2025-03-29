// src/health/kafka.health.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';

import { Kafka, Admin, logLevel, BrokerMetadata } from 'kafkajs';

@Injectable()
export class KafkaHealthIndicator {
  private kafka: Kafka;
  private admin: Admin;

  constructor(private readonly healthIndicatorService: HealthIndicatorService) {
    this.kafka = new Kafka({
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
      logLevel: logLevel.ERROR,
    });
    this.admin = this.kafka.admin();
  }

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    let isConnected = false;

    try {
      // 1. Connect with timeout
      await this.connectWithTimeout(5000);
      isConnected = true;

      // 2. Get cluster metadata
      const { brokers, controller, clusterId } = await this.admin.describeCluster();

      // 3. Validate brokers
      if (!brokers || brokers.length === 0) {
        return indicator.down({ error: 'No brokers available' });
      }

      // 4. Get topics (optional)
      const topics = await this.admin.listTopics();

      // 5. Format healthy response
      return indicator.up(this.formatHealthResponse(brokers, controller, clusterId, topics.length));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return indicator.down(this.formatErrorResponse(error));
      }
      return indicator.down({ error });
    } finally {
      if (isConnected) {
        await this.admin.disconnect();
      }
    }
  }

  private async connectWithTimeout(ms: number) {
    await Promise.race([
      this.admin.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Connection timeout after ${ms}ms`)), ms)
      ),
    ]);
  }

  private formatHealthResponse(
    brokers: BrokerMetadata['brokers'],
    controller: number | null,
    clusterId: string,
    topicsCount: number
  ): Record<string, unknown> {
    return {
      brokers,
      controller,
      clusterId,
      topicsCount,
    };
  }

  private formatErrorResponse(error: Error) {
    return {
      error: error.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    };
  }
}
