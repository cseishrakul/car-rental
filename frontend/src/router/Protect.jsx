import { Navigate, Outlet, useLocation } from "react-router";
import { RoutePermissions } from "./Permission";

export default function Protect() {
  const token = localStorage.getItem("auth_token");

  const user = JSON.parse(localStorage.getItem("auth_user"));
  const role = user?.role || "user";
  const location = useLocation();
  if (!token) return <Navigate to="/signin" replace />;
  const allowedRoles = RoutePermissions[location.pathname];
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
