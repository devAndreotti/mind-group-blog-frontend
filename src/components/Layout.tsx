import { BookOpen, LogOut, PenLine, ShieldCheck, UserRound } from "lucide-react";
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
          <span className="brand-mark">M</span>
          <span>Mind Blog</span>
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
    </div>
  );
};
