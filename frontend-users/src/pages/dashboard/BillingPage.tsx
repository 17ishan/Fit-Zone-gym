import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { getMyPayments } from "@/services/me.service";
import type { PaymentResponse } from "@/lib/types";
import { formatDate, formatINR } from "@/lib/format";
import { Panel, PageHeader, StatusBadge, Spinner, EmptyState, ErrorState } from "@/components/dashboard/parts";

/** Open a clean, printable receipt in a new window (user can Save as PDF). */
function printReceipt(p: PaymentResponse, customerName: string) {
  const win = window.open("", "_blank", "width=480,height=680");
  if (!win) return;
  win.document.write(`<!doctype html><html><head><title>Receipt ${p.id.slice(0, 8)}</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;padding:32px;}
      .brand{font-size:28px;font-weight:800;letter-spacing:.5px}
      .brand span{color:#FF0000}
      .muted{color:#666;font-size:12px}
      hr{border:none;border-top:1px solid #e5e5e5;margin:20px 0}
      .row{display:flex;justify-content:space-between;margin:8px 0;font-size:14px}
      .total{font-size:18px;font-weight:800;margin-top:12px}
      .total span{color:#FF0000}
      .tag{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:700;background:#eafaf0;color:#0a7d3c}
    </style></head><body>
    <div class="brand">Fit<span>Zone</span></div>
    <div class="muted">Payment Receipt</div>
    <hr/>
    <div class="row"><span>Receipt No.</span><strong>${p.id.slice(0, 8).toUpperCase()}</strong></div>
    <div class="row"><span>Date</span><strong>${formatDate(p.createdAt)}</strong></div>
    <div class="row"><span>Billed to</span><strong>${customerName}</strong></div>
    <div class="row"><span>Method</span><strong>${p.method ?? "—"}</strong></div>
    <div class="row"><span>Status</span><span class="tag">${p.status}</span></div>
    <hr/>
    <div class="row total"><span>Total paid</span><span>${formatINR(p.amountMinor)}</span></div>
    <hr/>
    <p class="muted">Thank you for being a FitZone member. This is a system-generated receipt.</p>
    </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

export default function BillingPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyPayments()
      .then((p) => setPayments([...p].sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load payments."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Billing & Payments" subtitle="Your payment history and downloadable receipts." />

      {error && <ErrorState message={error} />}

      {payments.length === 0 ? (
        <EmptyState title="No payments yet." hint="Payments appear here after you join a plan." />
      ) : (
        <Panel className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 text-zinc-400">{formatDate(p.createdAt)}</td>
                  <td className="px-5 py-3 font-medium text-[#FFFADC]">{formatINR(p.amountMinor)}</td>
                  <td className="px-5 py-3 text-zinc-400">{p.method ?? "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => printReceipt(p, user?.name ?? "Member")}
                      disabled={p.status !== "SUCCESS"}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
