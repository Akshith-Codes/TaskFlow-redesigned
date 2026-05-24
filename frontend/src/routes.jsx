import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import BoardPage from "./pages/BoardPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyEmail />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/board/:id" element={<BoardPage />} />
    </Routes>
  );
}

export default AppRoutes;