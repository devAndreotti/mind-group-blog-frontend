import { ArrowLeft, Clock, Edit3, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { articleApi } from "../services/api";
import type { Article } from "../types";
import { estimateReadingTime, formatDate, getErrorMessage } from "../utils";

export const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    articleApi
      .get(id)
      .then(setArticle)
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  const canManage = article && user && (user.role === "admin" || user.id === article.author.id);

  const handleDelete = async () => {
    if (!article) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await articleApi.remove(article.id);
      navigate("/articles");
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  if (error) {
    return <section className="page narrow">{error}</section>;
  }

  if (!article) {
    return <section className="page narrow">Carregando artigo...</section>;
  }

  return (
    <article className="page article-detail">
      <Link to="/articles" className="text-link">
        <ArrowLeft size={16} />
        Voltar
      </Link>

      {article.coverImage && <img className="detail-cover" src={article.coverImage} alt="" />}

      <div className="detail-header">
        <div className="meta-row">
          <span>{article.category?.name ?? "Sem categoria"}</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>
            <Clock size={14} />
            {estimateReadingTime(article.content)} min
          </span>
        </div>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
      </div>

      {canManage && (
        <div className="manage-row">
          <Link to={`/articles/${article.id}/edit`} className="button button-ghost">
            <Edit3 size={16} />
            Editar
          </Link>
          <button className="button button-danger" onClick={() => setConfirmDeleteOpen(true)}>
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Excluir artigo"
        message={`Tem certeza que deseja excluir "${article.title}"? Esta acao nao pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <div className="article-content">
        {article.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <footer className="author-box">
        <div className="avatar">
          <UserRound size={22} />
        </div>
        <div>
          <strong>{article.author.name}</strong>
          <p>{article.author.bio ?? "Autor do Mind Group Blog."}</p>
        </div>
      </footer>

      {article.tags.length > 0 && (
        <div className="tag-row large">
          {article.tags.map((tag) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </div>
      )}
    </article>
  );
};
