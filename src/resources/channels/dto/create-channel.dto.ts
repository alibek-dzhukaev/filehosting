import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ChannelType } from '../types/ChannelType';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsEnum(ChannelType)
  @IsOptional()
  readonly type?: ChannelType;

  @IsString()
  @IsNotEmpty()
  readonly ownerId: string;

  @IsOptional()
  @IsBoolean()
  readonly isReadonly?: boolean;

  @IsOptional()
  @IsString()
  readonly inviteLink?: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  readonly tags?: string[];
}
