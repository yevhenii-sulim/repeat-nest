import { Injectable } from '@nestjs/common';
import { createArticlesDTO } from '~/articles/articles.dto';
import { PrismaService } from '~/prisma/prisma.service';
import slugify from 'slugify';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}
  async create(currentUserId: number, article: createArticlesDTO): Promise<Article> {
    const slug = slugify(article.title, { lower: true });
    const createdArticle = this.prisma.article.create({
      data: {
        ...article,
        slug,
        author: {
          connect: { id: currentUserId },
        },
      },
    });
    return createdArticle;
  }
}
