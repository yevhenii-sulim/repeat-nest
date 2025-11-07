import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Article } from '@prisma/client';
import { createArticlesDTO, updateArticlesDTO } from '~/articles/articles.dto';
import { ArticlesService } from '~/articles/articles.service';
import { AuthGuard } from '~/guard/auth.guard';
import { User } from '~/user/user.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  @Get()
  getAll() {
    return this.articleService.getAll();
  }

  @Get(':slug')
  getArticle(@Param('slug') slug: string): Promise<Article | null> {
    return this.articleService.search(slug);
  }
  @Post('')
  @UseGuards(AuthGuard)
  create(
    @User('id') currentUserId: number,
    @Body(new ValidationPipe()) article: createArticlesDTO
  ): Promise<Article> {
    return this.articleService.create(currentUserId, article);
  }
  @Delete(':slug')
  @UseGuards(AuthGuard)
  delete(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<Article> {
    return this.articleService.delete(currentUserId, slug);
  }
  @Patch(':slug')
  @UseGuards(AuthGuard)
  update(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body() data: updateArticlesDTO
  ) {
    return this.articleService.update(currentUserId, slug, data);
  }
}
