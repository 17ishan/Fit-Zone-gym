import { LogOut } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-border bg-card/40 px-6 py-3">
      <div className="md:hidden">
        <span className="font-serif text-xl font-bold">
          <span className="text-[#FFFADC]">Fit</span>
          <span className="text-[#FF0000]">Zone</span>
        </span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
