import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserService } from './user.service';

const JWT_SECRET = process.env.JWT_SECRET;

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      req.user = null;
      next();
      return;
    }
    try {
      const decoded = verify(token, JWT_SECRET!) as JwtPayload;
      const currentUser = await this.userService.getUserById(decoded.id);
      req.user = currentUser;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
