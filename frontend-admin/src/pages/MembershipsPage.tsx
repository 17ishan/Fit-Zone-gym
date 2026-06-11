import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { membershipsService } from "@/services/memberships.service";
import type { MembershipResponse, MembershipStatus, PageResponse } from "@/lib/types";
import { formatDate, formatINR } from "@/lib/format";

const STATUSES: MembershipStatus[] = ["ACTIVE", "EXPIRED", "CANCELLED"];

export default function MembershipsPage() {
  const [data, setData] = useState<PageResponse<MembershipResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<MembershipStatus | "">("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    membershipsService
      .list(page, status || undefined)
      .then(setData)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id: string, next: MembershipStatus) => {
    try {
      await membershipsService.update(id, { status: next });
      toast.success("Status updated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this membership?")) return;
    try {
      await membershipsService.remove(id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const columns: Column<MembershipResponse>[] = [
    { header: "Member", cell: (m) => <span className="font-medium">{m.userName}</span> },
    { header: "Email", cell: (m) => m.userEmail },
    { header: "Plan", cell: (m) => m.planName },
    { header: "Price", cell: (m) => formatINR(m.priceMinor) },
    { header: "Start", cell: (m) => formatDate(m.startDate) },
    { header: "End", cell: (m) => formatDate(m.endDate) },
    {
      header: "Status",
      cell: (m) => (
        <select
          value={m.status}
          onChange={(e) => changeStatus(m.id, e.target.value as MembershipStatus)}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (m) => (
        <Button variant="destructive" size="sm" onClick={() => remove(m.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Memberships"
        subtitle="All purchased memberships"
        actions={
          <select
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value as MembershipStatus | "");
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        }
      />
      <DataTable
        columns={columns}
        rows={data?.content ?? []}
        loading={loading}
        rowKey={(m) => m.id}
        empty="No memberships yet."
      />
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
    </div>
  );
}
