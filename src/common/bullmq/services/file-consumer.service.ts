import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { BullMqQueues } from '../constants/queues';

@Injectable()
export class FileConsumerService implements OnModuleInit {
  private worker: Worker;

  constructor(private readonly redis: Redis) {}

  onModuleInit() {
    this.worker = new Worker(
      BullMqQueues.FILE,
      async (job) => {
        console.log(
          `Processing job ${job.id} with data: ${JSON.stringify(job.data)}`,
        );
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`Job ${job.id} completed`);
      },
      { connection: this.redis },
    );

    this.worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed with error: ${err.message}`);
    });
  }
}
