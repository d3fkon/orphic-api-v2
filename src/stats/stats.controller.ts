import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { AddStatDto } from './dto/add-stat.dto';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@UseInterceptors(new TransformInterceptor())
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post()
  addStat(@Body() data: AddStatDto) {
    return this.statsService.addStat(data);
  }

  @Get()
  getAllStats() {
    return this.statsService.getAllStats();
  }
}
