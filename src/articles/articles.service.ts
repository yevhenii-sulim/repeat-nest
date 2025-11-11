import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createArticlesDTO, updateArticlesDTO } from '~/articles/articles.dto';
import { PrismaService } from '~/prisma/prisma.service';
import slugify from 'slugify';
import { Article } from '@prisma/client';
import { ArticleResponseInterface } from '~/types/articleResponse.interface';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: any, currentUserId: number): Promise<ArticleResponseInterface> {
    let authorId: number | undefined;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    try {
      if (query.author) {
        const author = await this.prisma.user.findFirst({
          where: {
            userName: query.author,
          },
          select: {
            id: true,
          },
        });
        if (author) {
          authorId = author.id;
        }
      }
      const [articles, totalCount] = await Promise.all([
        this.prisma.article.findMany({
          where: {
            ...(currentUserId && { authorId: currentUserId }),
            ...(query.search && {
              title: {
                equals: query.search,
                mode: 'insensitive',
              },
            }),
            ...(query.tag && {
              tagList: {
                has: query.tag,
              },
            }),
            ...(query.author && { authorId }),
          },
          include: { favoriteBy: query.favorites && true },
          orderBy: {
            createdAt: query.sort === 'asc' ? 'asc' : 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.article.count({
          where: {
            ...(currentUserId && { authorId: currentUserId }),
            ...(query.search && {
              title: {
                equals: query.search,
                mode: 'insensitive',
              },
            }),
            ...(query.tag && {
              tagList: {
                has: query.tag,
              },
            }),
            ...(query.author && { authorId }),
          },
        }),
      ]);

      return { articles, articleCount: totalCount };
    } catch (error) {
      throw new Error(error.message);
    }
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
  async getArticleToFavorite(currentUserId: number, slug: string): Promise<any> {
    try {
      const article = await this.search(slug);
      if (!article) {
        throw new HttpException('article not found', HttpStatus.NOT_FOUND);
      }
      const isLiked = await this.prisma.favorite.findUnique({
        where: {
          userId_articleId: { userId: currentUserId, articleId: article.id },
        },
      });
      if (!isLiked) {
        const created = await this.prisma.$transaction([
          this.prisma.favorite.create({
            data: {
              userId: currentUserId,
              articleId: article.id,
            },
          }),
          this.prisma.article.update({
            where: { id: article.id },
            data: { favoritesCount: { increment: 1 } },
          }),
        ]);
        return created[1];
      } else {
        const deleted = await this.prisma.$transaction([
          this.prisma.favorite.delete({
            where: {
              userId_articleId: { userId: currentUserId, articleId: article.id },
            },
          }),
          this.prisma.article.update({
            where: { id: article.id },
            data: { favoritesCount: { decrement: 1 } },
          }),
        ]);
        return deleted[1];
      }
    } catch (error) {
      return error;
    }
  }
}
