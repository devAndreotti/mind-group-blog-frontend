import {
  BarChart2,
  Clock3,
  Edit3,
  FileText,
  Heart,
  MessageSquare,
  Plus,
  Settings,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleCoverPlaceholder } from "../components/ArticleCard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { articleApi } from "../services/api";
import type { Article } from "../types";
import { estimateReadingTime, formatDate, getErrorMessage } from "../utils";

const defaultAvatar =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces";

export const Dashboard = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setArticles(await articleApi.list());
  };

  useEffect(() => {
    load().catch(() => setArticles([]));
  }, []);

  const mine = useMemo(
    () => articles.filter((article) => user?.role === "admin" || article.author.id === user?.id),
    [articles, user]
  );
  const engagement = useMemo(
    () => mine.reduce((total, article) => total + article.tags.length + 1, 0),
    [mine]
  );
  const averageReadingTime = useMemo(() => {
    if (!mine.length) {
      return 0;
    }

    return Math.round(
      mine.reduce((total, article) => total + estimateReadingTime(article.content), 0) / mine.length
    );
  }, [mine]);

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    setDeleting(true);
    setError("");
    setNotice("");

    try {
      await articleApi.remove(pendingDelete.id);
      setPendingDelete(null);
      setNotice("Artigo excluido com sucesso.");
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Bem-vindo de volta, {user?.name ?? "autor"}!</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/settings" className="button button-ghost">
            <Settings size={16} />
            Configuracoes
          </Link>
          <Link to="/articles/new" className="button button-primary">
            <Plus size={16} />
            Novo Artigo
          </Link>
        </div>
      </div>

      {notice && <div className="success">{notice}</div>}
      {error && <div className="alert">{error}</div>}

      <div className="metric-row">
        <div>
          <span>
            Total de Artigos
            <FileText size={15} />
          </span>
          <strong>{mine.length}</strong>
        </div>
        <div>
          <span>
            Engajamento
            <MessageSquare size={15} />
          </span>
          <strong>{engagement}</strong>
        </div>
        <div>
          <span>
            Curtidas
            <Heart size={15} />
          </span>
          <strong>{mine.reduce((total, article) => total + article.tags.length, 0)}</strong>
        </div>
        <div>
          <span>
            Tempo medio de leitura
            <BarChart2 size={15} />
          </span>
          <strong>{averageReadingTime || 0} min</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel my-articles-panel">
          <h2>Meus Artigos</h2>
          {mine.length === 0 ? (
            <p className="empty-state">Nenhum artigo para gerenciar.</p>
          ) : (
            <div className="manage-list">
              {mine.map((article) => (
                <article className="manage-card" key={article.id}>
                  <Link to={`/articles/${article.id}`} className="manage-cover">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt="" />
                    ) : (
                      <ArticleCoverPlaceholder compact />
                    )}
                  </Link>
                  <div>
                    <h3>
                      <Link to={`/articles/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p>{article.summary}</p>
                    <div className="mini-stats">
                      <span>{formatDate(article.publishedAt)}</span>
                      <span>
                        <MessageSquare size={13} />
                        {article.tags.length}
                      </span>
                      <span>
                        <Heart size={13} />
                        {Math.max(1, article.tags.length)}
                      </span>
                    </div>
                  </div>
                  <div className="manage-actions">
                    <Link to={`/articles/${article.id}/edit`} className="button button-ghost">
                      <Edit3 size={14} />
                      Editar
                    </Link>
                    <button className="button button-danger" onClick={() => setPendingDelete(article)}>
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel activity-panel">
          <h2>Atividade Recente</h2>
          <div className="activity-list">
            {articles.slice(0, 3).map((article) => (
              <div className="activity-item" key={article.id}>
                <img src={defaultAvatar} alt="" />
                <div>
                  <p>
                    {article.author.name} publicou em <strong>{article.title}</strong>
                  </p>
                  <span>
                    <Clock3 size={13} />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Excluir artigo"
        message={`Tem certeza que deseja excluir "${pendingDelete?.title ?? "este artigo"}"? Esta acao nao pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
};
