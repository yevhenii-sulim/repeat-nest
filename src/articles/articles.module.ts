import { Module } from '@nestjs/common';
import { ArticlesController } from '~/articles/articles.controller';
import { ArticlesService } from '~/articles/articles.service';
import { AuthGuard } from '~/guard/auth.guard';
import { PrismaService } from '~/prisma/prisma.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, AuthGuard],
})
export class ArticlesModule {}
