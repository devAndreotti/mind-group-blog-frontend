import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, userApi } from "../services/api";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  updateProfile: (data: { name: string; email: string; bio: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem("mind_blog_token"));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("mind_blog_user");
    return stored ? (JSON.parse(stored) as User) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem("mind_blog_user", JSON.stringify(profile));
      })
      .catch(() => {
        localStorage.removeItem("mind_blog_token");
        localStorage.removeItem("mind_blog_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login: async (email, password) => {
        const response = await authApi.login({ email, password });
        localStorage.setItem("mind_blog_token", response.token);
        localStorage.setItem("mind_blog_user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
      },
      register: async (data) => {
        const response = await authApi.register(data);
        localStorage.setItem("mind_blog_token", response.token);
        localStorage.setItem("mind_blog_user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
      },
      updateProfile: async (data) => {
        const profile = await userApi.updateMe(data);
        localStorage.setItem("mind_blog_user", JSON.stringify(profile));
        setUser(profile);
      },
      logout: () => {
        localStorage.removeItem("mind_blog_token");
        localStorage.removeItem("mind_blog_user");
        setToken(null);
        setUser(null);
      }
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
