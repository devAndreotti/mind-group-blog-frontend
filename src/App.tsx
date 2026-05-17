import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ArticleDetail } from "./pages/ArticleDetail";
import { Articles } from "./pages/Articles";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="articles" element={<Articles />} />
      <Route path="articles/:id" element={<ArticleDetail />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
