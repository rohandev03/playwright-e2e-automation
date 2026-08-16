/**
 * Definición de modelos de dominio e interfaces fuertemente tipadas para Artículos y Comentarios.
 */

export interface ArticlePayload {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface ArticleAuthor {
  username: string;
  bio?: string | null;
  image?: string | null;
  following?: boolean;
}

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: ArticleAuthor;
}

export interface ArticleResponse {
  article: ArticleData;
}

export interface ArticlesFeedResponse {
  articles: ArticleData[];
  articlesCount: number;
}

export interface CommentData {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: ArticleAuthor;
}

export interface CommentResponse {
  comment: CommentData;
}

export interface CommentsListResponse {
  comments: CommentData[];
}
