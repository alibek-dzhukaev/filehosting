import { Expose } from 'class-transformer';

export class ChannelResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
