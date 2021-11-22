import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose';
import { StatEvents } from '../schemas/stat.schema';

export class AddStatDto {
  @ApiProperty()
  @IsNotEmpty()
  userPhoneNumber: string;

  @ApiProperty({
    enum: Object.values(StatEvents),
  })
  @IsNotEmpty()
  @IsEnum(StatEvents)
  event: StatEvents;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  itemId: string;
}
