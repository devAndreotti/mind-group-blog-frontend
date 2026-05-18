import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ArticleEditorPage } from "./pages/ArticleEditorPage";
import { ArticleDetail } from "./pages/ArticleDetail";
import { Articles } from "./pages/Articles";
import { Dashboard } from "./pages/Dashboard";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { ResetPassword } from "./pages/ResetPassword";

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="articles" element={<Articles />} />
      <Route path="articles/:id" element={<ArticleDetail />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="articles/new" element={<ArticleEditorPage />} />
        <Route path="articles/:id/edit" element={<ArticleEditorPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
