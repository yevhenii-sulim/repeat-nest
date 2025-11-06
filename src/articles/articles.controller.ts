import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { Article } from '@prisma/client';
import { createArticlesDTO } from '~/articles/articles.dto';
import { ArticlesService } from '~/articles/articles.service';
import { AuthGuard } from '~/guard/auth.guard';
import { User } from '~/user/user.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  @Get()
  getHello() {
    return 'hello';
  }
  @Post('')
  @UseGuards(AuthGuard)
  create(
    @User('id') currentUserId: number,
    @Body(new ValidationPipe()) article: createArticlesDTO
  ): Promise<Article> {
    return this.articleService.create(currentUserId, article);
  }
}
