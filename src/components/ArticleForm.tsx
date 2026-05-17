import { ImagePlus, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { taxonomyApi } from "../services/api";
import type { Article, ArticlePayload, Category } from "../types";
import { estimateReadingTime, fileToDataUrl } from "../utils";

const emptyPayload: ArticlePayload = {
  title: "",
  summary: "",
  content: "",
  categoryId: null,
  tags: [],
  coverImage: null
};

export const ArticleForm = ({
  initialArticle,
  onSubmit,
  submitting
}: {
  initialArticle?: Article | null;
  onSubmit: (payload: ArticlePayload) => Promise<void>;
  submitting: boolean;
}) => {
  const [form, setForm] = useState<ArticlePayload>(emptyPayload);
  const [tagText, setTagText] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    taxonomyApi.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!initialArticle) {
      return;
    }

    setForm({
      title: initialArticle.title,
      summary: initialArticle.summary,
      content: initialArticle.content,
      categoryId: initialArticle.category?.id ?? null,
      tags: initialArticle.tags.map((tag) => tag.name),
      coverImage: initialArticle.coverImage
    });
    setTagText(initialArticle.tags.map((tag) => tag.name).join(", "));
  }, [initialArticle]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      tags: tagText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label>
          Titulo
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
            minLength={3}
            placeholder="Titulo do artigo"
          />
        </label>

        <label>
          Categoria
          <select
            value={form.categoryId ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                categoryId: event.target.value ? Number(event.target.value) : null
              })
            }
          >
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Resumo
        <textarea
          value={form.summary}
          onChange={(event) => setForm({ ...form, summary: event.target.value })}
          required
          minLength={10}
          rows={3}
          placeholder="Resumo curto para listagem"
        />
      </label>

      <label>
        Tags
        <input
          value={tagText}
          onChange={(event) => setTagText(event.target.value)}
          placeholder="React, Node.js, MySQL"
        />
      </label>

      <label className="file-input">
        <ImagePlus size={18} />
        Imagem de capa
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) {
              setForm({ ...form, coverImage: await fileToDataUrl(file) });
            }
          }}
        />
      </label>

      {form.coverImage && (
        <img className="cover-preview" src={form.coverImage} alt="Preview da capa" />
      )}

      <label>
        Conteudo
        <textarea
          className="content-input"
          value={form.content}
          onChange={(event) => setForm({ ...form, content: event.target.value })}
          required
          minLength={20}
          maxLength={8000}
          rows={16}
          placeholder="Escreva o artigo..."
        />
      </label>

      <div className="editor-status">
        <span>{form.content.length}/8000 caracteres</span>
        <span>{estimateReadingTime(form.content)} min de leitura</span>
      </div>

      <button className="button button-primary button-large" type="submit" disabled={submitting}>
        <Save size={18} />
        {submitting ? "Salvando..." : "Salvar artigo"}
      </button>
    </form>
  );
};
