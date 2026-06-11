import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Mail } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { contactsService } from "@/services/contacts.service";
import type { ContactResponse, ContactStatus, PageResponse } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

const STATUSES: ContactStatus[] = ["NEW", "READ", "ARCHIVED"];

export default function ContactInboxPage() {
  const [data, setData] = useState<PageResponse<ContactResponse> | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<ContactStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactResponse | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    contactsService
      .list(page, status || undefined)
      .then(setData)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  const setRowStatus = async (id: string, next: ContactStatus) => {
    try {
      await contactsService.update(id, next);
      toast.success("Updated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await contactsService.remove(id);
      toast.success("Deleted");
      setSelected(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const open = (c: ContactResponse) => {
    setSelected(c);
    if (c.status === "NEW") setRowStatus(c.id, "READ");
  };

  const columns: Column<ContactResponse>[] = [
    { header: "From", cell: (c) => <span className="font-medium">{c.name}</span> },
    { header: "Email", cell: (c) => c.email },
    {
      header: "Message",
      cell: (c) => <span className="line-clamp-1 max-w-xs text-muted-foreground">{c.message}</span>,
    },
    { header: "Received", cell: (c) => formatDateTime(c.createdAt) },
    { header: "Status", cell: (c) => <StatusBadge value={c.status} /> },
    {
      header: "",
      className: "text-right",
      cell: (c) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => open(c)}>
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => remove(c.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Contact Inbox"
        subtitle="Enquiries from the website contact form"
        actions={
          <select
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value as ContactStatus | "");
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">All</option>
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
        rowKey={(c) => c.id}
        empty="No enquiries yet."
      />
      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Message from ${selected.name}` : ""}
        footer={
          selected && (
            <>
              <Button variant="outline" size="sm" onClick={() => setRowStatus(selected.id, "ARCHIVED")}>
                Archive
              </Button>
              <Button variant="destructive" size="sm" onClick={() => remove(selected.id)}>
                Delete
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">{selected.email}</p>
            <p className="whitespace-pre-wrap text-foreground">{selected.message}</p>
            <p className="pt-2 text-xs text-muted-foreground">{formatDateTime(selected.createdAt)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
