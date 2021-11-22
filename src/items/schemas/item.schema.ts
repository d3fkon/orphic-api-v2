import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({
  timestamps: true,
})
export class Item {
  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true, unique: true })
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  mainCategory: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  subCategory: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  rate: string;

  @ApiProperty()
  @IsNotEmpty()
  @Prop({ required: true })
  isNonVeg: boolean;

  @ApiProperty()
  @Prop()
  imageUrl: string;

  @ApiProperty()
  @Prop()
  modelUrl: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
