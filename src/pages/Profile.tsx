import { ArrowLeft, CalendarDays, Mail, Save, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate, getErrorMessage } from "../utils";

const defaultAvatar =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=faces";

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
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
      bio: user.bio ?? ""
    });
  }, [user]);

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
          <img src={defaultAvatar} alt="" />
          <label>
            Foto de Perfil
            <input
              value="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              readOnly
            />
          </label>
          <span>Adicione uma imagem ou deixe em branco</span>
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
