import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsUUID()
  messageId: string;
}
