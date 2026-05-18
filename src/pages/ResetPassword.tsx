import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../services/api";
import { getErrorMessage } from "../utils";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    token: searchParams.get("token") ?? "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await authApi.resetPassword(form);
      setMessage(response.message);
      setForm({ token: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">&lt;M/&gt;</div>
        <h1>Redefinir Senha</h1>
        <p>Use o token gerado para criar uma nova senha.</p>

        {error && <div className="alert">{error}</div>}
        {message && <div className="success">{message}</div>}

        <label>
          Token
          <input
            value={form.token}
            onChange={(event) => setForm({ ...form, token: event.target.value })}
            required
          />
        </label>

        <label>
          Nova senha
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            minLength={8}
          />
        </label>

        <label>
          Confirmar nova senha
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            required
            minLength={8}
          />
        </label>

        <button className="button button-primary button-large" disabled={loading}>
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>

        <span className="muted">
          Senha redefinida? <Link to="/login">Entrar</Link>
        </span>
      </form>
    </section>
  );
};
