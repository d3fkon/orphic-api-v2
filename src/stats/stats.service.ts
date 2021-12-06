import {
  BadRequestException,
  ImATeapotException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AddStatDto } from './dto/add-stat.dto';
import { Stat, StatDocument } from './schemas/stat.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Stat.name) private readonly statsModel: Model<StatDocument>,
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}
  async addStat(data: AddStatDto) {
    const user = await this.usersModel.findOne({
      phoneNumber: data.userPhoneNumber,
    });
    if (!user)
      throw new BadRequestException({
        error: 'User not found in the database',
      });
    let stat = await this.statsModel.create({
      user: user._id,
      item: data.itemId,
      event: data.event,
    });
  }
}
