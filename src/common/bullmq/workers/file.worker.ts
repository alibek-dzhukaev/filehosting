import { Logger } from '@nestjs/common';

import { Job, Worker } from 'bullmq';
import { Redis } from 'ioredis';

import { BullMqQueues } from '../constants/queues';

export const createFileWorker = (redis: Redis) => {
  return new Worker(
    BullMqQueues.FILE,
    async (job: Job) => {
      const logger = new Logger('fileWorker');
      logger.log(
        `Processing job ${job.id} with data: ${JSON.stringify(job.data)}`,
      );
      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 1000));
      logger.log(`Job ${job.id} completed`);
    },
    { connection: redis },
  );
};
