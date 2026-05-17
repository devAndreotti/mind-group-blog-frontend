import { ImagePlus, Plus, Save, X } from "lucide-react";
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
  const [tagDraft, setTagDraft] = useState("");
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
  }, [initialArticle]);

  const addTag = () => {
    const nextTag = tagDraft.trim();
    if (!nextTag || form.tags.includes(nextTag)) {
      return;
    }

    setForm({ ...form, tags: [...form.tags, nextTag] });
    setTagDraft("");
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((item) => item !== tag) });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <form className="editor-form article-editor-card" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label>
          Titulo do Artigo *
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
            minLength={3}
            maxLength={255}
            placeholder="O Futuro da Inteligencia Artificial em 2026"
          />
        </label>

        <label>
          Categoria *
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
        Resumo *
        <textarea
          value={form.summary}
          onChange={(event) => setForm({ ...form, summary: event.target.value })}
          required
          minLength={10}
          maxLength={500}
          rows={3}
          placeholder="Resumo curto para listagem"
        />
      </label>
      <span className="field-counter">{form.summary.length}/500 caracteres</span>

      <div className="cover-upload-row">
        <label className="file-input">
          <ImagePlus size={18} />
          Imagem de Capa
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
        <input
          value={form.coverImage ?? ""}
          onChange={(event) => setForm({ ...form, coverImage: event.target.value || null })}
          placeholder="uploads/2026/01/capa.png ou URL/data:image"
        />
      </div>

      {form.coverImage && (
        <img className="cover-preview" src={form.coverImage} alt="Preview da capa" />
      )}

      <div className="tag-editor">
        <label>
          Tags
          <span className="tag-input-row">
            <input
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder="TypeScript"
            />
            <button className="button button-ghost" type="button" onClick={addTag}>
              <Plus size={14} />
              Adicionar
            </button>
          </span>
        </label>
        {form.tags.length > 0 && (
          <div className="tag-chip-row">
            {form.tags.map((tag) => (
              <button key={tag} type="button" onClick={() => removeTag(tag)}>
                {tag}
                <X size={12} />
              </button>
            ))}
          </div>
        )}
      </div>

      <label>
        Conteudo do Artigo *
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
