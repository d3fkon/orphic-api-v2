import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { ConfigModule } from '@nestjs/config';
import { RewardsModule } from 'src/rewards/rewards.module';

@Module({
  imports: [
    RewardsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: '/user/login',
        method: RequestMethod.POST,
      })
      .forRoutes(UsersController);
  }
}
