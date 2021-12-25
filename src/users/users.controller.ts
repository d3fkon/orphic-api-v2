import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { request, Request, Response } from 'express';
import { RewardsService } from 'src/rewards/rewards.service';

@Controller('user')
@ApiTags('Users')
@UseInterceptors(new TransformInterceptor())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rewardsService: RewardsService,
  ) {}

  @Get('profile')
  async profile(@Req() request: Request) {
    await this.rewardsService.checkAndIssueRewards(
      request.user._id,
      request.clientId,
    );
    return request.user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
