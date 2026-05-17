import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { articleApi } from "../services/api";
import type { Article } from "../types";
import { formatDate, getErrorMessage } from "../utils";

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
          <p className="eyebrow">Area restrita</p>
          <h1>Dashboard</h1>
          <p>Gerencie artigos que sua conta pode alterar.</p>
        </div>
        <Link to="/articles/new" className="button button-primary">
          <Plus size={18} />
          Novo artigo
        </Link>
      </div>

      {notice && <div className="success">{notice}</div>}
      {error && <div className="alert">{error}</div>}

      <div className="metric-row">
        <div>
          <span>Total visivel</span>
          <strong>{articles.length}</strong>
        </div>
        <div>
          <span>Gerenciaveis</span>
          <strong>{mine.length}</strong>
        </div>
        <div>
          <span>Perfil</span>
          <strong>{user?.role === "admin" ? "Admin" : "Membro"}</strong>
        </div>
      </div>

      <div className="table-card">
        {mine.length === 0 ? (
          <p className="empty-state">Nenhum artigo para gerenciar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Artigo</th>
                <th>Categoria</th>
                <th>Publicado</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((article) => (
                <tr key={article.id}>
                  <td>
                    <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  </td>
                  <td>{article.category?.name ?? "-"}</td>
                  <td>{formatDate(article.publishedAt)}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/articles/${article.id}/edit`} className="icon-button">
                        <Edit3 size={17} />
                      </Link>
                      <button className="icon-button danger" onClick={() => setPendingDelete(article)}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
