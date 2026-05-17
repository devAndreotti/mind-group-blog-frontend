import { ArrowRight, Clock, Tags, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article } from "../types";
import { estimateReadingTime, formatDate } from "../utils";

export const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <article className="article-card">
      <Link to={`/articles/${article.id}`} className="cover">
        {article.coverImage ? (
          <img src={article.coverImage} alt="" />
        ) : (
          <div className="cover-fallback">
            <span>{article.category?.name ?? "Blog"}</span>
          </div>
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
            {estimateReadingTime(article.content)} min
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
