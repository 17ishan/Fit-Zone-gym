import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BadgeIndianRupee,
  LayoutList,
  Inbox,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/members", label: "Members", icon: Users },
  { to: "/memberships", label: "Memberships", icon: CreditCard },
  { to: "/payments", label: "Payments", icon: BadgeIndianRupee },
  { to: "/plans", label: "Plans", icon: LayoutList },
  { to: "/contacts", label: "Contact Inbox", icon: Inbox },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/60 p-4 md:flex">
      <div className="mb-8 px-2 py-3">
        <span className="font-serif text-2xl font-bold tracking-wide">
          <span className="text-[#FFFADC]">Fit</span>
          <span className="text-[#FF0000]">Zone</span>
        </span>
        <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#FF0000]/15 text-[#FF5757]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
