import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFC]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6D5EF7] border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}