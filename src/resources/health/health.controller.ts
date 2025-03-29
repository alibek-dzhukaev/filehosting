import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { KafkaHealthIndicator } from './kafka.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private kafka: KafkaHealthIndicator
  ) {}

  @Get('kafka')
  @HealthCheck()
  async checkKafka() {
    return this.health.check([async () => this.kafka.isHealthy('kafka')]);
  }
}
