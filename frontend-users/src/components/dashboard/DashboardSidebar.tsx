import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  ReceiptText,
  User,
  ArrowLeft,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

/** Shared so the mobile nav in the topbar can reuse the same items. */
export const DASHBOARD_NAV: DashboardNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/membership", label: "My Membership", icon: CreditCard },
  { to: "/dashboard/billing", label: "Billing", icon: ReceiptText },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 p-4 md:flex">
      <NavLink to="/" className="mb-8 flex items-center gap-2 px-2 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white">
          <Dumbbell className="h-5 w-5" />
        </span>
        <span>
          <span className="font-serif text-2xl font-bold">
            <span className="text-[#FFFADC]">Fit</span>
            <span className="text-[#FF0000]">Zone</span>
          </span>
          <span className="-mt-1 block text-[10px] uppercase tracking-widest text-zinc-500">Member</span>
        </span>
      </NavLink>

      <nav className="flex flex-col gap-1">
        {DASHBOARD_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#FF0000]/15 text-[#FF5757]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/"
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </NavLink>
    </aside>
  );
}
