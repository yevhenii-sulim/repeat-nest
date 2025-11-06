import { user } from '@prisma/client';
import { Request } from 'express';

export interface ExpressRequestInterface extends Request {
  user?: user;
}
