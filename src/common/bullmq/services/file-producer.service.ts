import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { BullMqJobs } from '../constants/jobs';
import { BullMqQueues } from '../constants/queues';

@Injectable()
export class FileProducerService {
  constructor(@InjectQueue(BullMqQueues.FILE) private readonly queue: Queue) {}

  async addJob(data: any) {
    await this.queue.add(BullMqJobs.FILE, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
