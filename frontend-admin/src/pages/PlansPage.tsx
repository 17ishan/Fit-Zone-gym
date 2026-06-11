import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Power } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { plansService } from "@/services/plans.service";
import type { PlanInput } from "@/services/plans.service";
import type { PlanResponse } from "@/lib/types";
import { formatINR } from "@/lib/format";

interface FormState {
  id?: number;
  name: string;
  priceRupees: string;
  durationMonths: string;
  features: string;
  popular: boolean;
  active: boolean;
  sortOrder: string;
}

const EMPTY: FormState = {
  name: "",
  priceRupees: "",
  durationMonths: "1",
  features: "",
  popular: false,
  active: true,
  sortOrder: "0",
};

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  const load = () => {
    setLoading(true);
    plansService
      .list()
      .then(setPlans)
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (p: PlanResponse) => {
    setForm({
      id: p.id,
      name: p.name,
      priceRupees: String(p.priceMinor / 100),
      durationMonths: String(p.durationMonths),
      features: p.features.join("\n"),
      popular: p.popular,
      active: p.active,
      sortOrder: String(p.sortOrder),
    });
    setOpen(true);
  };

  const save = async () => {
    const body: PlanInput = {
      name: form.name.trim(),
      priceMinor: Math.round(parseFloat(form.priceRupees || "0") * 100),
      durationMonths: parseInt(form.durationMonths || "1", 10),
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      popular: form.popular,
      active: form.active,
      sortOrder: parseInt(form.sortOrder || "0", 10),
    };
    if (!body.name) {
      toast.error("Name is required");
      return;
    }
    try {
      if (form.id) await plansService.update(form.id, body);
      else await plansService.create(body);
      toast.success(form.id ? "Plan updated" : "Plan created");
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const deactivate = async (p: PlanResponse) => {
    if (!confirm(`Deactivate "${p.name}"? It will be hidden from the website.`)) return;
    try {
      await plansService.deactivate(p.id);
      toast.success("Plan deactivated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const columns: Column<PlanResponse>[] = [
    { header: "Name", cell: (p) => <span className="font-medium">{p.name}</span> },
    { header: "Price", cell: (p) => formatINR(p.priceMinor) },
    { header: "Duration", cell: (p) => `${p.durationMonths} mo` },
    { header: "Features", cell: (p) => <span className="text-xs text-muted-foreground">{p.features.length} items</span> },
    { header: "Popular", cell: (p) => (p.popular ? "★" : "—") },
    { header: "Status", cell: (p) => <StatusBadge value={p.active ? "ACTIVE" : "ARCHIVED"} /> },
    {
      header: "",
      className: "text-right",
      cell: (p) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
            <Pencil className="h-4 w-4" />
          </Button>
          {p.active && (
            <Button variant="destructive" size="sm" onClick={() => deactivate(p)}>
              <Power className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Plans"
        subtitle="Membership plans shown on the website"
        actions={
          <Button size="sm" className="gap-2 bg-[#FF0000] text-white hover:bg-[#AF0404]" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        }
      />
      <DataTable columns={columns} rows={plans} loading={loading} rowKey={(p) => p.id} empty="No plans yet." />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={form.id ? "Edit Plan" : "New Plan"}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-[#FF0000] text-white hover:bg-[#AF0404]" onClick={save}>
              Save
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={form.priceRupees}
              onChange={(e) => setForm({ ...form, priceRupees: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (months)</Label>
            <Input
              id="duration"
              type="number"
              value={form.durationMonths}
              onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <textarea
              id="features"
              rows={5}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.popular}
                onChange={(e) => setForm({ ...form, popular: e.target.checked })}
              />
              Popular
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
