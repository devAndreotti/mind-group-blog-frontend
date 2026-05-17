import { BookOpen, Github, Linkedin, LogOut, Moon, PenLine, ShieldCheck, Twitter, UserRound } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Mind Group Blog">
          <span className="brand-mark">&lt;M/&gt;</span>
        </Link>

        <nav className="nav-links" aria-label="Navegacao principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/articles">
            <BookOpen size={16} />
            Artigos
          </NavLink>
          {user && (
            <NavLink to="/dashboard">
              <ShieldCheck size={16} />
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="topbar-actions">
          <button className="theme-button" type="button" aria-label="Tema escuro">
            <Moon size={16} />
          </button>
          {user ? (
            <>
              <span className="user-chip">
                <UserRound size={15} />
                {user.name}
              </span>
              <Link to="/articles/new" className="button button-primary">
                <PenLine size={16} />
                Novo
              </Link>
              <button className="icon-button" onClick={handleLogout} aria-label="Sair">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="button button-ghost">
                Entrar
              </Link>
              <Link to="/register" className="button button-primary">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              &lt;M/&gt;
            </Link>
            <p>Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.</p>
          </div>

          <div className="footer-links">
            <div>
              <strong>Navegacao</strong>
              <Link to="/">Home</Link>
              <Link to="/articles">Artigos</Link>
              {user && <Link to="/dashboard">Dashboard</Link>}
            </div>
            <div>
              <strong>Redes Sociais</strong>
              <div className="social-row" aria-label="Redes sociais">
                <Linkedin size={16} />
                <Github size={16} />
                <Twitter size={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Mind Blog. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
};
