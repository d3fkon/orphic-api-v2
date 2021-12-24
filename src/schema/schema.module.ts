import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from 'src/items/schemas/item.schema';
import { Reward, RewardSchema } from 'src/rewards/schemas/reward.schema';
import { Stat, StatSchema } from 'src/stats/schemas/stat.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Stat.name, schema: StatSchema }]),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  ],
  exports: [MongooseModule],
})
export class SchemaModule {}
