import {
  ArrowLeft,
  Bookmark,
  Clock,
  Edit3,
  Eye,
  Heart,
  MessageCircle,
  Send,
  Share2,
  Trash2,
  UserRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArticleCoverPlaceholder } from "../components/ArticleCard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { articleApi, userApi } from "../services/api";
import type { Article, PublicUserProfile } from "../types";
import { estimateReadingTime, formatDate, getErrorMessage } from "../utils";

const getInitial = (name?: string) => name?.trim().charAt(0).toUpperCase() || "U";

const AuthorAvatar = ({ name, avatar }: { name?: string; avatar?: string | null }) => (
  <div className="avatar">
    {avatar ? (
      <img src={avatar} alt="" />
    ) : (
      <span className="avatar-fallback" aria-hidden="true">
        {getInitial(name)}
      </span>
    )}
  </div>
);

export const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [authorProfile, setAuthorProfile] = useState<PublicUserProfile | null>(null);
  const [error, setError] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    setAuthorProfile(null);
    articleApi
      .get(id)
      .then(setArticle)
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  useEffect(() => {
    if (!article) {
      return;
    }

    userApi
      .getPublicProfile(article.author.id)
      .then(setAuthorProfile)
      .catch(() => setAuthorProfile(null));
  }, [article]);

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

  const authorName = authorProfile?.name ?? article.author.name;
  const authorBio = authorProfile?.bio ?? article.author.bio ?? "Autor do Mind Group Blog.";
  const authorAvatar = authorProfile?.avatar ?? null;

  return (
    <article className="page article-detail">
      <Link to="/articles" className="text-link">
        <ArrowLeft size={16} />
        Voltar aos Artigos
      </Link>

      <div className="detail-header">
        <span className="category-pill">{article.category?.name ?? "Sem categoria"}</span>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>

        <div className="detail-author-row">
          <AuthorAvatar name={authorName} avatar={authorAvatar} />
          <div>
            <strong>{authorName}</strong>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <span>
            <Clock size={14} />
            {estimateReadingTime(article.content)} min
          </span>
          <div className="detail-actions">
            <Heart size={16} />
            <Bookmark size={16} />
            <Share2 size={16} />
          </div>
        </div>

        <div className="detail-stats">
          <span>
            <Heart size={14} />
            {Math.max(1, article.tags.length)} curtidas
          </span>
          <span>
            <Eye size={14} />
            {article.id * 37} visualizacoes
          </span>
          <span>
            <MessageCircle size={14} />2 comentarios
          </span>
        </div>
      </div>

      <div className="detail-cover-frame">
        {article.coverImage ? (
          <img className="detail-cover" src={article.coverImage} alt="" />
        ) : (
          <ArticleCoverPlaceholder />
        )}
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
        <AuthorAvatar name={authorName} avatar={authorAvatar} />
        <div>
          <strong>{authorName}</strong>
          <p>{authorBio}</p>
        </div>
      </footer>

      {article.tags.length > 0 && (
        <div className="tag-row large">
          {article.tags.map((tag) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </div>
      )}

      <section className="comments-section">
        <h2>Comentarios (2)</h2>
        <div className="comment-card">
          <div className="avatar">
            <UserRound size={20} />
          </div>
          <div>
            <div className="comment-header">
              <strong>{article.author.name}</strong>
              <span>{formatDate(article.publishedAt)}</span>
              <span>
                <Heart size={13} />1
              </span>
            </div>
            <p>Excelente artigo. O conteudo explica bem os pontos principais.</p>
          </div>
        </div>
        <div className="comment-card">
          <div className="avatar">
            <UserRound size={20} />
          </div>
          <div>
            <div className="comment-header">
              <strong>Marie Smith</strong>
              <span>{formatDate(article.updatedAt)}</span>
              <span>
                <Heart size={13} />4
              </span>
            </div>
            <p>Artigo muito interessante. Ficou claro como aplicar a ideia na pratica.</p>
          </div>
        </div>

        <form className="comment-form" onSubmit={(event) => event.preventDefault()}>
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            rows={4}
            placeholder="Otimo artigo. Esperando pelo proximo!"
          />
          <button className="button button-primary" type="submit">
            <Send size={15} />
            Publicar Comentario
          </button>
        </form>
      </section>
    </article>
  );
};
