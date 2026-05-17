import { Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { articleApi, taxonomyApi } from "../services/api";
import type { Article, Category } from "../types";

export const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await articleApi.list({ search, categoryId });
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    taxonomyApi.categories().then(setCategories).catch(() => setCategories([]));
    loadArticles().catch(() => setArticles([]));
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    loadArticles().catch(() => setArticles([]));
  };

  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Biblioteca</p>
          <h1>Todos os artigos</h1>
        </div>
      </div>

      <form className="filters" onSubmit={handleSubmit}>
        <label>
          Buscar
          <div className="input-icon">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Titulo, resumo ou conteudo"
            />
          </div>
        </label>

        <label>
          Categoria
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <button className="button button-primary" type="submit">
          Filtrar
        </button>
      </form>

      {loading ? (
        <p className="empty-state">Carregando artigos...</p>
      ) : articles.length === 0 ? (
        <p className="empty-state">Nenhum artigo encontrado.</p>
      ) : (
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
};
