import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { paymentsService } from "@/services/payments.service";
import type { PageResponse, PaymentResponse, PaymentStatus } from "@/lib/types";
import { formatDateTime, formatINR } from "@/lib/format";

const STATUSES: PaymentStatus[] = ["PENDING", "SUCCESS", "FAILED"];

export default function PaymentsPage() {
  const [data, setData] = useState<PageResponse<PaymentResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    paymentsService
      .list(page, status || undefined)
      .then(setData)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id: string, next: PaymentStatus) => {
    try {
      await paymentsService.update(id, { status: next });
      toast.success("Payment updated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    try {
      await paymentsService.remove(id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const columns: Column<PaymentResponse>[] = [
    { header: "Member", cell: (p) => <span className="font-medium">{p.userName}</span> },
    { header: "Amount", cell: (p) => formatINR(p.amountMinor) },
    { header: "Method", cell: (p) => p.method ?? "—" },
    { header: "Reference", cell: (p) => <span className="text-xs">{p.providerPaymentId ?? "—"}</span> },
    { header: "Date", cell: (p) => formatDateTime(p.createdAt) },
    {
      header: "Status",
      cell: (p) => (
        <select
          value={p.status}
          onChange={(e) => changeStatus(p.id, e.target.value as PaymentStatus)}
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
      cell: (p) => (
        <Button variant="destructive" size="sm" onClick={() => remove(p.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Transaction history"
        actions={
          <select
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value as PaymentStatus | "");
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
        rowKey={(p) => p.id}
        empty="No payments yet."
      />
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
    </div>
  );
}
