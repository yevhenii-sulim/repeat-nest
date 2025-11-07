import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createArticlesDTO, updateArticlesDTO } from '~/articles/articles.dto';
import { PrismaService } from '~/prisma/prisma.service';
import slugify from 'slugify';
import { Article } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}
  async getAll() {
    const articles = await this.prisma.article.findMany();
    return articles;
  }
  async create(currentUserId: number, article: createArticlesDTO): Promise<Article> {
    const slug = this.getSlug(article.title);
    try {
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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  private getSlug(str: string) {
    return slugify(str, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString();
  }
  async search(slug: string): Promise<Article | null> {
    try {
      const article = await this.prisma.article.findFirst({
        where: {
          slug: {
            contains: slug,
          },
        },
      });

      return article;
    } catch (error) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }
  async delete(currentUserId: number, slug: string): Promise<Article> {
    try {
      const deletedArticle = await this.prisma.article.delete({
        where: { authorId_slug: { authorId: currentUserId, slug } },
      });
      return deletedArticle;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Something went wrong', HttpStatus.FORBIDDEN);
    }
  }
  async update(currentUserId: number, slug: string, data: updateArticlesDTO): Promise<Article> {
    try {
      const updatedArticle = await this.prisma.article.update({
        where: { authorId_slug: { authorId: currentUserId, slug } },
        data: data,
      });
      return updatedArticle;
    } catch (error) {
      throw new HttpException('have no permission', HttpStatus.FORBIDDEN);
    }
  }
}
