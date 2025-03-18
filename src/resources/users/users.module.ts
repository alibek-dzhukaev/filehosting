import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';

import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
