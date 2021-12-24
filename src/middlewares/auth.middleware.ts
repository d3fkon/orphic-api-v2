import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction, response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  /**
   *
   * @param req The request data of the current request
   * @param res Response data of the curent request
   * @param next Next function passthrought
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const { accessToken, clientId: clientIdCookie } = req.cookies;
    const { clientId } = req.headers;
    if (!accessToken) throw new UnauthorizedException();
    try {
      const userId = await this.userService.verifyToken(accessToken);
      const user = await this.userService.findOne(userId);
      if (!user) throw 'User not found';
      req.user = user;
      req.clientId = clientId as string;
      // If there is a clientId coming from the header, then use it
      if (clientId) res.cookie('clientId', clientId);
      // Otherwise use the clientId coming from the cookie
      else res.cookie('clientId', clientIdCookie);
      next();
    } catch (e) {
      // Invalid user
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
