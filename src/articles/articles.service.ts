import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createArticlesDTO } from '~/articles/articles.dto';
import { PrismaService } from '~/prisma/prisma.service';
import slugify from 'slugify';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}
  async create(currentUserId: number, article: createArticlesDTO): Promise<Article> {
    const slug = this.getSlug(article.title);
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
  private getSlug(str: string) {
    return slugify(str, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString();
  }
  async search(slug: string): Promise<Article> {
    const article = await this.prisma.article.findFirst({
      where: {
        slug: {
          contains: slug,
        },
      },
    });
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }
}
