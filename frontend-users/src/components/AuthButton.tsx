import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

/** Navbar auth control: "Sign in" link when logged out, dashboard + logout when in. */
export default function AuthButton() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0000] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#AF0404]"
        >
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </button>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate("/login")}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-sm text-white transition hover:bg-white/10"
    >
      <LogIn className="h-4 w-4" /> Sign in
    </button>
  );
}
