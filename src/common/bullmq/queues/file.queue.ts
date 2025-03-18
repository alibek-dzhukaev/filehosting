import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { Queue } from 'bullmq';

import { BullMqJobs } from '../constants/jobs';
import { BullMqQueues } from '../constants/queues';

@Processor(BullMqQueues.FILE)
@Injectable()
export class FileQueue implements OnModuleInit {
  private readonly logger = new Logger(FileQueue.name);

  constructor(@InjectQueue(BullMqQueues.FILE) private readonly queue: Queue) {}

  onModuleInit() {
    this.logger.log('FileQueue initialized');
  }

  async addJob(data: unknown) {
    await this.queue.add(BullMqJobs.FILE, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
