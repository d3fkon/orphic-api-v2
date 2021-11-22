import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) {}

  // Create an item
  async createItem(data: Item) {
    return this.itemModel.create(data);
  }

  async findAllItems() {
    return this.itemModel.find();
  }
}
