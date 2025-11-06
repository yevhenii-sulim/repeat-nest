import { Module } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { AuthGuard } from '~/guard/auth.guard';
import { UserController } from '~/user/user.controller';
import { UserService } from '~/user/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
