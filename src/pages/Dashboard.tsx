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
import { articleApi, dashboardApi } from "../services/api";
import type { DashboardArticle, DashboardSummary } from "../types";
import { formatDate, getErrorMessage } from "../utils";

const defaultAvatar =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces";

export const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DashboardArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setSummary(await dashboardApi.get());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch((err) => {
      setError(getErrorMessage(err));
      setSummary(null);
      setLoading(false);
    });
  }, []);

  const recentArticles = summary?.recentArticles ?? [];
  const totalArticles = summary?.totalArticles ?? 0;
  const categoryCount = useMemo(
    () => new Set(recentArticles.map((article) => article.category?.name).filter(Boolean)).size,
    [recentArticles]
  );
  const lastUpdate = recentArticles[0]?.updatedAt ?? recentArticles[0]?.updated_at ?? null;

  const getArticleDate = (article: DashboardArticle) =>
    article.updatedAt ?? article.updated_at ?? article.publishedAt ?? article.created_at ?? "";

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
          <strong>{totalArticles}</strong>
        </div>
        <div>
          <span>
            Artigos Recentes
            <MessageSquare size={15} />
          </span>
          <strong>{recentArticles.length}</strong>
        </div>
        <div>
          <span>
            Categorias Recentes
            <Heart size={15} />
          </span>
          <strong>{categoryCount}</strong>
        </div>
        <div>
          <span>
            Ultima atualizacao
            <BarChart2 size={15} />
          </span>
          <strong>{lastUpdate ? formatDate(lastUpdate) : "-"}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel my-articles-panel">
          <h2>Meus Artigos Recentes</h2>
          {loading ? (
            <p className="empty-state">Carregando dashboard...</p>
          ) : recentArticles.length === 0 ? (
            <p className="empty-state">Nenhum artigo para gerenciar.</p>
          ) : (
            <div className="manage-list">
              {recentArticles.map((article) => (
                <article className="manage-card" key={article.id}>
                  <Link to={`/articles/${article.id}`} className="manage-cover">
                    <ArticleCoverPlaceholder compact />
                  </Link>
                  <div>
                    <h3>
                      <Link to={`/articles/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p>{article.summary}</p>
                    <div className="mini-stats">
                      <span>{getArticleDate(article) ? formatDate(getArticleDate(article)) : "-"}</span>
                      <span>
                        <MessageSquare size={13} />
                        {article.category?.name ?? "Sem categoria"}
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
            {loading ? (
              <p className="empty-state">Carregando atividade...</p>
            ) : recentArticles.length === 0 ? (
              <p className="empty-state">Nenhuma atividade recente.</p>
            ) : (
              recentArticles.slice(0, 3).map((article) => (
              <div className="activity-item" key={article.id}>
                <img src={defaultAvatar} alt="" />
                <div>
                  <p>
                    {user?.name ?? "Voce"} atualizou <strong>{article.title}</strong>
                  </p>
                  <span>
                    <Clock3 size={13} />
                    {getArticleDate(article) ? formatDate(getArticleDate(article)) : "-"}
                  </span>
                </div>
              </div>
              ))
            )}
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
