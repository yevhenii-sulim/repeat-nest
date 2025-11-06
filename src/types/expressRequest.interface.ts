import { User } from '@prisma/client';
import { Request } from 'express';

export interface ExpressRequestInterface extends Request {
  user?: User;
}
