import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { Role } from '@application/common/roles/constants/roles.constant';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsNumberString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsString()
  @IsOptional()
  readonly city?: string;

  @IsDateString()
  @IsOptional()
  readonly dateOfBirthday?: string;

  @IsString()
  @IsOptional()
  readonly gender?: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  readonly roles?: Role[];
}
