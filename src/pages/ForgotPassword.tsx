import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../services/api";
import { getErrorMessage } from "../utils";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResetToken("");
    setError("");

    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response.message);
      setResetToken(response.reset_token);
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
        <h1>Recuperar Senha</h1>
        <p>Informe seu email para gerar um token de redefinicao.</p>

        {error && <div className="alert">{error}</div>}
        {message && <div className="success">{message}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <button className="button button-primary button-large" disabled={loading}>
          {loading ? "Gerando..." : "Gerar token"}
        </button>

        {resetToken && (
          <div className="reset-token-box">
            <span>Token de redefinicao</span>
            <code>{resetToken}</code>
            <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`}>
              Redefinir senha
            </Link>
          </div>
        )}

        <span className="muted">
          Lembrou a senha? <Link to="/login">Entrar</Link>
        </span>
      </form>
    </section>
  );
};
