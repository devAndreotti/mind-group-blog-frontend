export type User = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  role: "admin" | "member";
  createdAt: string;
  updatedAt?: string;
};

export type Category = {
  id: number;
  name: string;
  createdAt?: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Article = {
  id: number;
  title: string;
  summary: string;
  content: string;
  coverImage: string | null;
  category: Category | null;
  author: {
    id: number;
    name: string;
    bio: string | null;
    role: "admin" | "member";
  };
  tags: Tag[];
  publishedAt: string;
  updatedAt: string;
};

export type DashboardArticle = {
  id: number;
  title: string;
  summary: string;
  created_at?: string;
  updated_at?: string;
  publishedAt?: string;
  updatedAt?: string;
  category: Pick<Category, "name"> | null;
};

export type DashboardSummary = {
  totalArticles: number;
  recentArticles: DashboardArticle[];
};

export type ArticlePayload = {
  title: string;
  summary: string;
  content: string;
  categoryId: number | null;
  tags: string[];
  coverImage: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
};
