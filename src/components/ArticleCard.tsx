import { ArrowRight, Clock, Eye, Heart, ImageOff, Tags, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article } from "../types";
import { estimateReadingTime, formatDate } from "../utils";

export const ArticleCoverPlaceholder = ({ compact = false }: { compact?: boolean }) => (
  <div className="cover-placeholder">
    <div className="cover-empty-state">
      <ImageOff size={compact ? 18 : 24} />
      <span>Sem imagem</span>
    </div>
  </div>
);

export const ArticleCard = ({
  article,
  variant = "grid"
}: {
  article: Article;
  variant?: "grid" | "list" | "compact";
}) => {
  const readingTime = estimateReadingTime(article.content);

  return (
    <article className={`article-card article-card-${variant}`}>
      <Link to={`/articles/${article.id}`} className="cover">
        {article.coverImage ? (
          <img src={article.coverImage} alt="" />
        ) : (
          <ArticleCoverPlaceholder compact={variant !== "grid"} />
        )}
      </Link>

      <div className="article-card-body">
        <div className="meta-row">
          <span>{article.category?.name ?? "Sem categoria"}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <h2>
          <Link to={`/articles/${article.id}`}>{article.title}</Link>
        </h2>

        <p>{article.summary}</p>

        <div className="article-footer">
          <span>
            <UserRound size={14} />
            {article.author.name}
          </span>
          <span>
            <Clock size={14} />
            {readingTime} min
          </span>
          <span>
            <Eye size={14} />
            {article.id * 37}
          </span>
          <span>
            <Heart size={14} />
            {article.tags.length}
          </span>
        </div>

        {article.tags.length > 0 && (
          <div className="tag-row">
            <Tags size={14} />
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag.id}>{tag.name}</span>
            ))}
          </div>
        )}

        <Link to={`/articles/${article.id}`} className="read-link">
          Ler artigo
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
};
