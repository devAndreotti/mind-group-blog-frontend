import {
  Github,
  Grid2X2,
  Linkedin,
  LogOut,
  Moon,
  Settings,
  Twitter
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getInitial = (name?: string) => name?.trim().charAt(0).toUpperCase() || "U";

const UserAvatar = ({ name, avatar }: { name?: string; avatar?: string | null }) =>
  avatar ? (
    <img src={avatar} alt="" />
  ) : (
    <span className="avatar-fallback" aria-hidden="true">
      {getInitial(name)}
    </span>
  );

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
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
            Home
          </NavLink>
          <NavLink to="/articles">Artigos</NavLink>
        </nav>

        <div className="topbar-actions">
          <span className="topbar-divider" aria-hidden="true" />
          <button className="theme-button" type="button" aria-label="Tema escuro">
            <Moon size={16} />
          </button>
          {user ? (
            <div className="user-menu">
              <button
                className="avatar-button"
                type="button"
                aria-label="Abrir menu do usuario"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <UserAvatar name={user.name} avatar={user.avatar} />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-profile">
                    <div className="dropdown-avatar">
                      <UserAvatar name={user.name} avatar={user.avatar} />
                    </div>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>
                    <Grid2X2 size={16} />
                    Dashboard
                  </Link>
                  <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                    <Settings size={16} />
                    Configuracoes
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="button button-link">
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
