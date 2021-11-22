import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Item } from 'src/items/schemas/item.schema';

export enum StatEvents {
  USER_OPENED_VIEW_AR = 'USER_OPENEN_VIEW_AR',
  USER_CLOSED_VIEW_AR = 'USER_CLOSED_VIEW_AR',
  USER_OPENED_MODEL = 'USER_OPENED_MODEL',
  USER_CLOSED_MODEL = 'USER_CLOSED_MODEL',
}

@Schema({
  timestamps: true,
})
export class Stat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: string | User;

  @Prop({ enum: Object.values(StatEvents) })
  event: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Item.name })
  item: string | Item;
}

export type StatDocument = mongoose.Document & Stat;

export const StatSchema = SchemaFactory.createForClass(Stat);
