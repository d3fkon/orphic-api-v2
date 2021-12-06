import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from 'src/items/schemas/item.schema';
import { StatSchema } from 'src/stats/schemas/stat.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Stats', schema: StatSchema }]),
    MongooseModule.forFeature([{ name: 'Items', schema: ItemSchema }]),
  ],
  exports: [MongooseModule],
})
export class SchemaModule {}
