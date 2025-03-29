import { Expose } from 'class-transformer';

export class MessageResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };

  @Expose()
  channelId?: string;

  @Expose()
  recipientId?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  isEdited: boolean;
}
