import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usersService } from "@/services/users.service";
import type { PageResponse, UserResponse } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function MembersPage() {
  const [data, setData] = useState<PageResponse<UserResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    usersService
      .list(page, query)
      .then(setData)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load members"))
      .finally(() => setLoading(false));
  }, [page, query]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn();
      toast.success(ok);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    }
  };

  const columns: Column<UserResponse>[] = [
    { header: "Name", cell: (u) => <span className="font-medium">{u.name}</span> },
    { header: "Email", cell: (u) => u.email },
    { header: "Phone", cell: (u) => u.phone ?? "—" },
    { header: "Role", cell: (u) => <StatusBadge value={u.role} /> },
    { header: "Joined", cell: (u) => formatDate(u.createdAt) },
    {
      header: "Actions",
      className: "text-right",
      cell: (u) => (
        <div className="flex justify-end gap-2">
          {u.role === "ADMIN" ? (
            <Button
              variant="outline"
              size="sm"
              title="Demote to user"
              onClick={() => act(() => usersService.demote(u.id), "Demoted to USER")}
            >
              <ShieldOff className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              title="Promote to admin"
              onClick={() => act(() => usersService.promote(u.id), "Promoted to ADMIN")}
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            title="Delete member"
            onClick={() => {
              if (confirm(`Delete ${u.name}? This removes their memberships and payments.`))
                act(() => usersService.remove(u.id), "Member deleted");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Members"
        subtitle="All registered users"
        actions={
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or email…"
              className="w-64 pl-8"
              value={query}
              onChange={(e) => {
                setPage(0);
                setQuery(e.target.value);
              }}
            />
          </div>
        }
      />
      <DataTable
        columns={columns}
        rows={data?.content ?? []}
        loading={loading}
        rowKey={(u) => u.id}
        empty="No members yet."
      />
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
    </div>
  );
}
