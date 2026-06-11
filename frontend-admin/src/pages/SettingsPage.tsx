import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allowlistService } from "@/services/allowlist.service";
import type { AllowlistResponse } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function SettingsPage() {
  const [entries, setEntries] = useState<AllowlistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const load = () => {
    setLoading(true);
    allowlistService
      .list()
      .then(setEntries)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const add = async () => {
    const e = email.trim();
    if (!e) return;
    try {
      await allowlistService.add(e);
      toast.success("Admin added");
      setEmail("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Remove this admin email? They will lose admin access on next login.")) return;
    try {
      await allowlistService.remove(id);
      toast.success("Removed");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const columns: Column<AllowlistResponse>[] = [
    { header: "Email", cell: (a) => <span className="font-medium">{a.email}</span> },
    { header: "Added by", cell: (a) => a.addedBy ?? "—" },
    { header: "Added on", cell: (a) => formatDate(a.createdAt) },
    {
      header: "",
      className: "text-right",
      cell: (a) => (
        <Button variant="destructive" size="sm" onClick={() => remove(a.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Settings" subtitle="Admin access allowlist" />

      <div className="mb-6 flex max-w-md items-end gap-2">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Add admin email</label>
          <Input
            type="email"
            placeholder="someone@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="mt-1"
          />
        </div>
        <Button className="gap-2 bg-[#FF0000] text-white hover:bg-[#AF0404]" onClick={add}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={entries}
        loading={loading}
        rowKey={(a) => a.id}
        empty="No allowlisted admins (bootstrap admins from server config can still log in)."
      />
      <p className="mt-3 text-xs text-muted-foreground">
        Only Google accounts on this list (or the server's bootstrap emails) can sign in to the admin
        portal.
      </p>
    </div>
  );
}
