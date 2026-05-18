import { ArrowLeft, CalendarDays, ImagePlus, Mail, Save, UserRound } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fileToDataUrl, formatDate, getErrorMessage } from "../utils";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const getInitial = (name?: string) => name?.trim().charAt(0).toUpperCase() || "U";

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", bio: "", avatar: null as string | null });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name,
      email: user.email,
      bio: user.bio ?? "",
      avatar: user.avatar ?? null
    });
  }, [user]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setNotice("");
    setError("");

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setError("Avatar deve ser PNG, JPG ou WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar deve ter no maximo 2MB.");
      event.target.value = "";
      return;
    }

    setForm({ ...form, avatar: await fileToDataUrl(file) });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    try {
      await updateProfile(form);
      setNotice("Configuracoes salvas.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="page settings-page">
      <Link to="/dashboard" className="text-link back-link">
        <ArrowLeft size={16} />
        Voltar ao Dashboard
      </Link>

      <div className="section-heading settings-heading">
        <div>
          <h1>Configuracoes do Perfil</h1>
          <p>Gerencie suas informacoes pessoais</p>
        </div>
      </div>

      <form className="settings-card" onSubmit={handleSubmit}>
        {notice && <div className="success">{notice}</div>}
        {error && <div className="alert">{error}</div>}

        <div className="profile-photo-block">
          <div className="profile-avatar-preview">
            {form.avatar ? (
              <img src={form.avatar} alt="" />
            ) : (
              <span className="avatar-fallback" aria-hidden="true">
                {getInitial(form.name)}
              </span>
            )}
          </div>
          <label className="profile-avatar-input">
            Foto de Perfil
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
            />
          </label>
          <span>
            <ImagePlus size={13} />
            PNG, JPG ou WebP ate 2MB
          </span>
        </div>

        <div className="field-with-icon">
          <UserRound size={16} />
          <label>
            Nome Completo
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              minLength={3}
              required
            />
          </label>
        </div>

        <div className="field-with-icon">
          <Mail size={16} />
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
        </div>

        <label>
          Bio
          <textarea
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
            maxLength={500}
            rows={5}
          />
        </label>
        <span className="field-counter">{form.bio.length}/500 caracteres</span>

        <div className="account-info">
          <h2>Informacoes da conta</h2>
          <div>
            <span>Tipo de conta</span>
            <strong>{user.role === "admin" ? "Admin" : "Membro"}</strong>
          </div>
          <div>
            <span>Membro desde</span>
            <strong>
              <CalendarDays size={14} />
              {formatDate(user.createdAt)}
            </strong>
          </div>
        </div>

        <button className="button button-primary button-large" type="submit" disabled={saving}>
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar Alteracoes"}
        </button>
      </form>
    </section>
  );
};
