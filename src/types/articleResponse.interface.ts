import { Article } from '@prisma/client';

export interface ArticleResponseInterface {
  articles: Article[];
  articleCount: number;
}
