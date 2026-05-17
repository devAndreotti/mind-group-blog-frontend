import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>
  </Routes>
);
