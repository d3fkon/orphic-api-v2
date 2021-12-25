import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { RewardsService } from './rewards.service';

@Controller('rewards')
@ApiTags('Rewards')
@UseInterceptors(new TransformInterceptor())
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('user')
  getAllRewards(@Req() request: Request) {
    return this.rewardsService.getRewardsForUser(
      request.user?._id,
      request.clientId,
    );
  }
}
