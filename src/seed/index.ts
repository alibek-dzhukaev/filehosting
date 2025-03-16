// src/seeds/index.ts
import { Seeder as TypeormSeeder } from 'typeorm-extension';
import CreateUsers from './user.seed';
import { AppDataSource } from '../data-source'
import { Logger } from '@nestjs/common'

export default class Seeder implements TypeormSeeder {
  private readonly logger = new Logger(Seeder.name)

  public async run(): Promise<void> {
    this.logger.log('initializing data source :: seed')
    const dataSource = await AppDataSource.initialize()
    this.logger.log('initialized data source :: seed')
    await new CreateUsers().run(dataSource);
  }
}