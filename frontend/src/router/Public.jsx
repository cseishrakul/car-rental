import { Navigate, Outlet } from "react-router";

export default function Public() {
  const token = localStorage.getItem("auth_token");
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
