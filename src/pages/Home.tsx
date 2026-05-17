import { BookOpen, PenLine, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { articleApi } from "../services/api";
import type { Article } from "../types";

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    articleApi.list().then(setArticles).catch(() => setArticles([]));
  }, []);

  return (
    <section className="page">
      <div className="hero-app">
        <div>
          <p className="eyebrow">Mind Group Blog</p>
          <h1>Artigos, autores e painel de publicacao em um fluxo direto.</h1>
          <p>
            Leitura publica para visitantes. Escrita, edicao e remocao protegidas por login.
          </p>
          <div className="hero-actions">
            <Link to="/articles" className="button button-primary">
              <BookOpen size={18} />
              Explorar artigos
            </Link>
            <Link to="/articles/new" className="button button-ghost">
              <PenLine size={18} />
              Escrever
            </Link>
          </div>
        </div>

        <div className="proof-panel">
          <div>
            <ShieldCheck size={24} />
            <strong>CRUD protegido</strong>
            <span>JWT + autor/admin</span>
          </div>
          <div>
            <BookOpen size={24} />
            <strong>{articles.length}</strong>
            <span>artigos carregados</span>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Recentes</p>
          <h2>Ultimos artigos</h2>
        </div>
        <Link to="/articles" className="text-link">
          Ver todos
        </Link>
      </div>

      <div className="article-grid">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};
