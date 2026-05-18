import axios from "axios";
import type {
  ArticlePayload,
  AuthResponse,
  Category,
  Article,
  DashboardSummary,
  Tag,
  User
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

export const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mind_blog_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },
  me: async () => {
    const response = await api.get<User>("/users/me");
    return response.data;
  }
};

export const userApi = {
  updateMe: async (data: { name: string; email: string; bio: string; avatar?: string | null }) => {
    const response = await api.put<User>("/users/me", data);
    return response.data;
  }
};

export const dashboardApi = {
  get: async () => {
    const response = await api.get<DashboardSummary>("/dashboard");
    return response.data;
  }
};

export const articleApi = {
  list: async (params?: { search?: string; categoryId?: string }) => {
    const response = await api.get<Article[]>("/articles", { params });
    return response.data;
  },
  get: async (id: string | number) => {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },
  create: async (data: ArticlePayload) => {
    const response = await api.post<{ id: number }>("/articles", data);
    return response.data;
  },
  update: async (id: string | number, data: ArticlePayload) => {
    const response = await api.put<{ id: number }>(`/articles/${id}`, data);
    return response.data;
  },
  remove: async (id: string | number) => {
    await api.delete(`/articles/${id}`);
  }
};

export const taxonomyApi = {
  categories: async () => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },
  tags: async () => {
    const response = await api.get<Tag[]>("/tags");
    return response.data;
  }
};
