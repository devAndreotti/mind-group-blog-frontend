import { Grid3X3, List, Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { articleApi, taxonomyApi } from "../services/api";
import type { Article, Category } from "../types";

export const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
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
          <h1>Todos os artigos</h1>
          <p>Explore nossa colecao completa de artigos tecnicos</p>
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

        <div className="view-toggle" aria-label="Modo de visualizacao">
          <button
            className={`icon-button ${viewMode === "grid" ? "active" : ""}`}
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Ver em cards"
          >
            <Grid3X3 size={17} />
          </button>
          <button
            className={`icon-button ${viewMode === "list" ? "active" : ""}`}
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="Ver em lista"
          >
            <List size={17} />
          </button>
        </div>

        <button className="button button-primary" type="submit">
          Filtrar
        </button>
      </form>

      {loading ? (
        <p className="empty-state">Carregando artigos...</p>
      ) : articles.length === 0 ? (
        <p className="empty-state">Nenhum artigo encontrado.</p>
      ) : (
        <div className={viewMode === "list" ? "article-list" : "article-grid"}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant={viewMode} />
          ))}
        </div>
      )}
    </section>
  );
};
