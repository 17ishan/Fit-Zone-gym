import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Dumbbell } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { getMyMemberships } from "@/services/me.service";
import { getPlans, createMembershipPurchase } from "@/services/membership.service";
import type { MembershipResponse, PlanResponse } from "@/lib/types";
import { formatDate, formatINR, daysUntil } from "@/lib/format";
import { Panel, PageHeader, StatusBadge, Spinner, EmptyState, ErrorState } from "@/components/dashboard/parts";
import CustomerDetailsModal from "@/components/CustomerDetailsModal";
import type { CustomerData } from "@/components/CustomerDetailsModal";
import PaymentFlowModal from "@/components/PaymentFlowModal";
import { fireConfetti } from "@/lib/confetti";
import { usePrefersReducedMotion } from "@/hooks/useInteractivityEnabled";

function pickActive(list: MembershipResponse[]): MembershipResponse | null {
  const active = list
    .filter((m) => m.status === "ACTIVE")
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
  return active[0] ?? null;
}

function planPrice(p: PlanResponse): string {
  return `${formatINR(p.priceMinor)}${p.durationMonths >= 12 ? "/yr" : "/mo"}`;
}

export default function MembershipPage() {
  const { user } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [memberships, setMemberships] = useState<MembershipResponse[]>([]);
  const [plans, setPlans] = useState<PlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Purchase flow
  const [selectedPlan, setSelectedPlan] = useState<PlanResponse | null>(null);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([getMyMemberships(), getPlans().catch(() => [])])
      .then(([m, p]) => {
        setMemberships(m);
        setPlans(p);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load memberships."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function handleJoin(plan: PlanResponse) {
    setSelectedPlan(plan);
    setShowCustomer(true);
    setMessage(null);
  }

  function handleCustomerSubmit(data: CustomerData) {
    setCustomerData(data);
    setShowCustomer(false);
    setShowPayment(true);
  }

  async function handlePurchase() {
    if (!selectedPlan || !customerData) return;
    setIsProcessing(true);
    try {
      await createMembershipPurchase({ planId: selectedPlan.id, customerData });
      setMessage(`🎉 "${selectedPlan.name}" activated. Welcome aboard!`);
      closeModals();
      if (!prefersReducedMotion) fireConfetti();
      load();
    } catch (err) {
      setMessage(err instanceof Error ? `❌ ${err.message}` : "❌ Purchase failed.");
      setShowPayment(false);
    } finally {
      setIsProcessing(false);
    }
  }

  function closeModals() {
    setShowCustomer(false);
    setShowPayment(false);
    setSelectedPlan(null);
    setCustomerData(null);
  }

  if (loading) return <Spinner />;

  const active = pickActive(memberships);
  const hasActive = Boolean(active);

  return (
    <div>
      <PageHeader title="My Membership" subtitle="Your plan, digital card, and renewal options." />

      {error && <ErrorState message={error} />}
      {message && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#FFFADC]">
          {message}
        </div>
      )}

      {/* Active membership + digital card */}
      {active && (
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel className="flex flex-col justify-between bg-gradient-to-br from-[#1a1a1a] to-[#111]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-widest text-zinc-500">Current plan</span>
                <StatusBadge status={active.status} />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-[#FFFADC]">{active.planName}</div>
              <div className="mt-1 text-lg font-bold text-[#FF0000]">{formatINR(active.priceMinor)}</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-zinc-500">Started</div>
                <div className="font-medium text-[#FFFADC]">{formatDate(active.startDate)}</div>
              </div>
              <div>
                <div className="text-zinc-500">Valid till</div>
                <div className="font-medium text-[#FFFADC]">{formatDate(active.endDate)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-zinc-500">Days remaining</div>
                <div className="font-medium text-[#FFFADC]">{Math.max(daysUntil(active.endDate), 0)} days</div>
              </div>
            </div>
          </Panel>

          {/* Digital membership card with QR for check-in */}
          <Panel className="flex flex-col items-center justify-center bg-gradient-to-br from-[#FF0000]/15 to-[#111] text-center">
            <div className="mb-3 flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-[#FF0000]" />
              <span className="font-serif text-xl font-bold">
                <span className="text-[#FFFADC]">Fit</span>
                <span className="text-[#FF0000]">Zone</span>
              </span>
            </div>
            <div className="rounded-xl bg-white p-3">
              <QRCodeSVG value={`FITZONE:${active.id}`} size={132} level="M" />
            </div>
            <div className="mt-3 font-semibold text-[#FFFADC]">{user?.name}</div>
            <div className="text-xs text-zinc-500">Show this at the front desk to check in</div>
            <div className="mt-1 font-mono text-[10px] text-zinc-600">ID {active.id.slice(0, 8).toUpperCase()}</div>
          </Panel>
        </div>
      )}

      {/* Plans: join / renew / upgrade */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">
        {hasActive ? "Renew or upgrade" : "Choose a plan"}
      </h2>
      {plans.length === 0 ? (
        <EmptyState title="Plans are unavailable right now." hint="Please try again shortly." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border bg-[#111] p-5 ${
                plan.popular ? "border-[#FF0000]/60" : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#FFFADC]">{plan.name}</h3>
                {plan.popular && (
                  <span className="rounded-full bg-[#FF0000] px-2 py-0.5 text-[10px] font-semibold text-white">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-1 text-xl font-extrabold text-[#FF0000]">{planPrice(plan)}</div>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF0000]" />
                    <span className="text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleJoin(plan)}
                className="mt-5 w-full rounded-xl bg-[#FF0000] py-2.5 text-sm font-semibold text-white transition hover:bg-[#AF0404]"
              >
                {hasActive ? "Switch to this plan" : `Join ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Membership history */}
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-widest text-zinc-500">History</h2>
      {memberships.length === 0 ? (
        <EmptyState title="No memberships yet." hint="Join a plan above to get started." />
      ) : (
        <Panel className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Start</th>
                <th className="px-5 py-3">End</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-[#FFFADC]">{m.planName}</td>
                  <td className="px-5 py-3 text-zinc-300">{formatINR(m.priceMinor)}</td>
                  <td className="px-5 py-3 text-zinc-400">{formatDate(m.startDate)}</td>
                  <td className="px-5 py-3 text-zinc-400">{formatDate(m.endDate)}</td>
                  <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {/* Purchase modals (reused from the landing page) */}
      {selectedPlan && (
        <CustomerDetailsModal
          isOpen={showCustomer}
          onClose={closeModals}
          onSubmit={handleCustomerSubmit}
          planName={selectedPlan.name}
          planPrice={planPrice(selectedPlan)}
        />
      )}
      {selectedPlan && customerData && (
        <PaymentFlowModal
          isOpen={showPayment}
          onClose={closeModals}
          onPurchase={handlePurchase}
          planName={selectedPlan.name}
          planPrice={planPrice(selectedPlan)}
          customerName={customerData.name}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
