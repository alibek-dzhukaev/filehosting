import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsArray, IsEnum } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

import { Role } from '@application/common/roles/constants/roles.constant';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ name: 'date_of_birthday', nullable: true })
  dateOfBirthday?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ default: [Role.USER], type: 'enum', enum: Role, array: true })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
