import { CalendarDays, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils";

export const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <section className="page narrow">
      <div className="profile-card">
        <div className="avatar large">
          <UserRound size={34} />
        </div>
        <div>
          <p className="eyebrow">Perfil</p>
          <h1>{user.name}</h1>
          <p>{user.bio ?? "Sem bio cadastrada."}</p>
          <div className="meta-row">
            <span>{user.role === "admin" ? "Administrador" : "Membro"}</span>
            <span>
              <CalendarDays size={14} />
              Desde {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
