import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArticleForm } from "../components/ArticleForm";
import { articleApi } from "../services/api";
import type { Article, ArticlePayload } from "../types";
import { getErrorMessage } from "../utils";

export const ArticleEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    articleApi
      .get(id)
      .then(setArticle)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload: ArticlePayload) => {
    setSubmitting(true);
    setError("");

    try {
      const result = id ? await articleApi.update(id, payload) : await articleApi.create(payload);
      navigate(`/articles/${result.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page narrow">
      <Link to="/dashboard" className="text-link">
        <ArrowLeft size={16} />
        Dashboard
      </Link>

      <div className="section-heading">
        <div>
          <h1>{id ? "Editar Artigo" : "Criar Novo Artigo"}</h1>
          <p>{id ? "Atualize o artigo publicado." : "Compartilhe seu conhecimento com a comunidade"}</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <p className="empty-state">Carregando artigo...</p>
      ) : (
        <ArticleForm initialArticle={article} onSubmit={handleSubmit} submitting={submitting} />
      )}
    </section>
  );
};
