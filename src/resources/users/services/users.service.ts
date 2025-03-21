import { Injectable } from '@nestjs/common';

import { In } from 'typeorm';

import { User } from '@resources/users/entities/user.entity';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: string) {
    return this.usersRepository.findOneById(id);
  }

  async findByIds(userIds: User['id'][]) {
    return this.usersRepository.findManyBy({ where: { id: In(userIds) } });
  }

  async findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ where: { username } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
