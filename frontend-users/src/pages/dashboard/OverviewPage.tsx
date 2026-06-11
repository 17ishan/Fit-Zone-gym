import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, ReceiptText, User, CalendarClock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { getMyMemberships, getMyPayments } from "@/services/me.service";
import type { MembershipResponse, PaymentResponse } from "@/lib/types";
import { formatDate, formatINR, daysUntil } from "@/lib/format";
import { Panel, PageHeader, StatusBadge, Spinner, ErrorState } from "@/components/dashboard/parts";

/** The active membership (latest end date among ACTIVE), else the most recent of any. */
function pickActive(list: MembershipResponse[]): MembershipResponse | null {
  if (!list.length) return null;
  const active = list
    .filter((m) => m.status === "ACTIVE")
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
  if (active.length) return active[0];
  return [...list].sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
}

export default function OverviewPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<MembershipResponse[]>([]);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMyMemberships(), getMyPayments()])
      .then(([m, p]) => {
        setMemberships(m);
        setPayments(p);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load your data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const active = pickActive(memberships);
  const daysLeft = active && active.status === "ACTIVE" ? daysUntil(active.endDate) : null;
  const latestPayment = [...payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's a quick look at your FitZone membership."
      />

      {error && <ErrorState message={error} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Panel>
          <div className="mb-3 flex items-center gap-2 text-zinc-400">
            <CreditCard className="h-4 w-4 text-[#FF0000]" />
            <span className="text-sm">Membership</span>
          </div>
          {active ? (
            <>
              <div className="text-xl font-bold text-[#FFFADC]">{active.planName}</div>
              <div className="mt-2"><StatusBadge status={active.status} /></div>
            </>
          ) : (
            <div className="text-sm text-zinc-500">No membership yet</div>
          )}
        </Panel>

        <Panel>
          <div className="mb-3 flex items-center gap-2 text-zinc-400">
            <CalendarClock className="h-4 w-4 text-[#FF0000]" />
            <span className="text-sm">Days remaining</span>
          </div>
          {daysLeft !== null ? (
            <>
              <div className="text-3xl font-extrabold text-[#FFFADC]">{Math.max(daysLeft, 0)}</div>
              <div className="mt-1 text-xs text-zinc-500">Valid till {formatDate(active?.endDate)}</div>
            </>
          ) : (
            <div className="text-sm text-zinc-500">—</div>
          )}
        </Panel>

        <Panel>
          <div className="mb-3 flex items-center gap-2 text-zinc-400">
            <ReceiptText className="h-4 w-4 text-[#FF0000]" />
            <span className="text-sm">Latest payment</span>
          </div>
          {latestPayment ? (
            <>
              <div className="text-xl font-bold text-[#FFFADC]">{formatINR(latestPayment.amountMinor)}</div>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={latestPayment.status} />
                <span className="text-xs text-zinc-500">{formatDate(latestPayment.createdAt)}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-zinc-500">No payments yet</div>
          )}
        </Panel>
      </div>

      {!active && (
        <Panel className="mt-6 flex flex-col items-start gap-3 border-[#FF0000]/30 bg-gradient-to-r from-[#FF0000]/10 to-transparent sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#FF0000]" />
            <div>
              <div className="font-semibold text-[#FFFADC]">Ready to start your fitness journey?</div>
              <div className="text-sm text-zinc-400">Pick a plan and join FitZone today.</div>
            </div>
          </div>
          <Link
            to="/dashboard/membership"
            className="rounded-full bg-[#FF0000] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#AF0404]"
          >
            View plans
          </Link>
        </Panel>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-widest text-zinc-500">Quick actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink to="/dashboard/membership" icon={CreditCard} label="My Membership" desc="Renew, upgrade, view card" />
        <QuickLink to="/dashboard/billing" icon={ReceiptText} label="Billing & Payments" desc="History & receipts" />
        <QuickLink to="/dashboard/profile" icon={User} label="Profile" desc="Update your details" />
      </div>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
  desc,
}: {
  to: string;
  icon: typeof CreditCard;
  label: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#111] p-5 transition-colors hover:border-[#FF0000]/40"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0000]/10 ring-1 ring-[#FF0000]/30">
          <Icon className="h-5 w-5 text-[#FF0000]" />
        </span>
        <div>
          <div className="font-semibold text-[#FFFADC]">{label}</div>
          <div className="text-xs text-zinc-500">{desc}</div>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-[#FF0000]" />
    </Link>
  );
}
