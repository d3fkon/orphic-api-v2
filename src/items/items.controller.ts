import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { Item } from './schemas/item.schema';
import { ItemsService } from './items.service';
import { ApiTags } from '@nestjs/swagger';

@UseInterceptors(new TransformInterceptor())
@Controller('items')
@ApiTags('Items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  addItem(@Body() itemData: Item) {
    return this.itemsService.createItem(itemData);
  }

  @Get()
  allItems() {
    return this.itemsService.findAllItems();
  }
}
