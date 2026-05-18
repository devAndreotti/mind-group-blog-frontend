import { BookOpen, PenLine } from "lucide-react";
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
        <p className="eyebrow">Mind Group Blog</p>
        <h1>
          Explore o Futuro da <span>Tecnologia</span>
        </h1>
        <p>Artigos sobre IA, desenvolvimento, DevOps e as ultimas tendencias tecnologicas.</p>
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

      <div className="section-heading">
        <div>
          <h2>Artigos em Destaque</h2>
          <p>Os melhores conteudos selecionados para voce</p>
        </div>
        <Link to="/articles" className="text-link">
          Ver todos
        </Link>
      </div>

      <div className="article-grid">
        {articles.slice(0, 4).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="section-heading">
        <div>
          <h2>Artigos Recentes</h2>
          <p>Conteudo recente da comunidade</p>
        </div>
      </div>

      <div className="recent-grid">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={`recent-${article.id}`} article={article} variant="compact" />
        ))}
      </div>

      <section className="newsletter-band">
        <BookOpen size={22} />
        <h2>Newsletter Semanal</h2>
        <p>Receba os melhores artigos de tecnologia diretamente no seu email.</p>
        <div className="newsletter-form">
          <input aria-label="Email para newsletter" placeholder="seu@email.com" />
          <button className="button button-primary" type="button">
            Inscrever
          </button>
        </div>
      </section>

      <section className="cta-band">
        <h2>Compartilhe Seu Conhecimento</h2>
        <p>Junte-se a nossa comunidade de autores e compartilhe suas experiencias.</p>
        <Link to="/articles/new" className="button button-primary">
          Criar Conta Gratis
        </Link>
      </section>
    </section>
  );
};
