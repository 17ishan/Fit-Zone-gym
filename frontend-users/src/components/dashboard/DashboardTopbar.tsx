import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV } from "./DashboardSidebar";

export function DashboardTopbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="font-serif text-xl font-bold md:hidden">
          <span className="text-[#FFFADC]">Fit</span>
          <span className="text-[#FF0000]">Zone</span>
        </NavLink>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-[#FFFADC]">{user?.name}</div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile nav (sidebar is hidden < md) */}
      <nav className="no-scrollbar flex gap-1 overflow-x-auto border-t border-white/10 px-2 py-2 md:hidden">
        {DASHBOARD_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                isActive ? "bg-[#FF0000]/15 text-[#FF5757]" : "text-zinc-400 hover:text-white"
              )
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
