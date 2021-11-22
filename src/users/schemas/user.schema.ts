import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @IsNotEmpty()
  @Prop({ required: true })
  name: string;
  @IsNotEmpty()
  @Prop({ required: true })
  phoneNumber: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
