import { useEffect, useState } from "react";
import { CheckCircle2, Star, Zap, Crown, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CustomerDetailsModal from "./CustomerDetailsModal";
import type { CustomerData } from "./CustomerDetailsModal";
import PaymentFlowModal from "./PaymentFlowModal";
import { createMembershipPurchase, getPlans } from "@/services/membership.service";
import { useAuth } from "@/auth/AuthContext";
import { BlurFade } from "./magicui/blur-fade";
import { BorderBeam } from "./magicui/border-beam";
import GradientText from "./reactbits/GradientText";

interface DisplayPlan {
  id: number; // -1 for offline fallback (purchase disabled)
  title: string;
  price: string;
  priceCents: number;
  features: string[];
  icon: LucideIcon;
  popular?: boolean;
}

const ICONS: LucideIcon[] = [Star, Zap, Crown, Trophy];

// Fallback shown only if the backend is unreachable (display-only; cannot purchase).
const FALLBACK_PLANS: DisplayPlan[] = [
  { id: -1, title: "Basic", price: "₹799/mo", priceCents: 79900, icon: Star, features: ["Access to gym floor", "Locker room access", "1 Personal Trainer session"] },
  { id: -1, title: "Standard", price: "₹1,499/mo", priceCents: 149900, icon: Zap, popular: true, features: ["Everything in Basic", "Group fitness classes", "Diet consultation", "4 PT sessions/month"] },
  { id: -1, title: "Premium", price: "₹2,499/mo", priceCents: 249900, icon: Crown, features: ["Everything in Standard", "Unlimited PT sessions", "Massage & recovery zone", "Priority support"] },
  { id: -1, title: "Annual Elite", price: "₹24,999/yr", priceCents: 2499900, icon: Trophy, features: ["Unlimited gym access", "Unlimited PT sessions", "Spa & recovery access", "Exclusive VIP events", "Dedicated nutritionist"] },
];

function formatPrice(priceMinor: number, durationMonths: number): string {
  const amount = (priceMinor / 100).toLocaleString("en-IN");
  return durationMonths >= 12 ? `₹${amount}/yr` : `₹${amount}/mo`;
}

export default function MembershipSection() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<DisplayPlan[]>(FALLBACK_PLANS);
  const [message, setMessage] = useState<string | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getPlans()
      .then((apiPlans) => {
        if (!apiPlans.length) return;
        setPlans(
          apiPlans.map((p, i) => ({
            id: p.id,
            title: p.name,
            price: formatPrice(p.priceMinor, p.durationMonths),
            priceCents: p.priceMinor,
            features: p.features,
            icon: ICONS[i % ICONS.length],
            popular: p.popular,
          }))
        );
      })
      .catch(() => {
        /* keep fallback plans */
      });
  }, []);

  function handleJoin(idx: number) {
    setSelectedPlanIndex(idx);
    setShowCustomerModal(true);
    setMessage(null);
  }

  function handleCustomerSubmit(data: CustomerData) {
    setCustomerData(data);
    setShowCustomerModal(false);
    setShowPaymentModal(true);
  }

  async function handlePurchase() {
    if (selectedPlanIndex === null || !customerData) return;
    const plan = plans[selectedPlanIndex];

    if (!user) {
      setShowPaymentModal(false);
      setMessage("🔒 Please sign in with Google (top-right) to complete your purchase.");
      setTimeout(() => setMessage(null), 8000);
      return;
    }
    if (plan.id < 0) {
      setShowPaymentModal(false);
      setMessage("⚠️ Plans are temporarily unavailable. Please try again shortly.");
      setTimeout(() => setMessage(null), 8000);
      return;
    }

    setIsProcessing(true);
    setMessage(null);
    try {
      await createMembershipPurchase({ planId: plan.id, customerData });
      setMessage(`🎉 Success! Membership "${plan.title}" purchased for ${customerData.name}.`);
      setShowPaymentModal(false);
      setSelectedPlanIndex(null);
      setCustomerData(null);
    } catch (err) {
      console.error(err);
      setMessage(err instanceof Error ? `❌ Error: ${err.message}` : "❌ Failed to complete purchase.");
      setShowPaymentModal(false);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setMessage(null), 8000);
    }
  }

  function handleCloseModals() {
    setShowCustomerModal(false);
    setShowPaymentModal(false);
    setSelectedPlanIndex(null);
    setCustomerData(null);
  }

  return (
    <section className="bg-black text-[#FFFADC] py-24 px-6 font-serif" id="membership">
      <div className="max-w-7xl mx-auto">
        <BlurFade>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF0000]">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Our <GradientText>Membership Plans</GradientText>
            </h2>
            <p className="mt-4 text-gray-400">
              Whether you're just starting out or chasing premium perks, there's a plan for you.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <BlurFade key={`${plan.title}-${idx}`} delay={idx * 0.1} className="h-full">
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#111] p-7 transition-transform duration-300 ${
                    plan.popular
                      ? "border-[#FF0000]/60 shadow-2xl shadow-[#FF0000]/20 lg:-translate-y-3 lg:scale-[1.03]"
                      : "border-gray-800 hover:border-[#FF0000]/50 hover:-translate-y-1"
                  }`}
                >
                  {plan.popular && (
                    <>
                      <BorderBeam size={140} duration={8} />
                      <span className="absolute top-0 right-0 rounded-bl-lg bg-[#FF0000] px-3 py-1 text-xs font-semibold text-white">
                        Popular
                      </span>
                    </>
                  )}

                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0000]/10 ring-1 ring-[#FF0000]/30">
                    <Icon className="h-6 w-6 text-[#FF0000]" />
                  </div>

                  <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
                  <div className="text-2xl font-extrabold text-[#FF0000] mb-5">{plan.price}</div>

                  <ul className="space-y-2.5 mb-7 text-sm">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF0000]" />
                        <span className="text-gray-200">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleJoin(idx)}
                    className="mt-auto w-full rounded-xl bg-[#FF0000] py-2.5 font-semibold text-white transition hover:bg-[#AF0404]"
                  >
                    Join {plan.title}
                  </button>
                </div>
              </BlurFade>
            );
          })}
        </div>

        {message && <div className="mt-8 text-center text-sm text-green-400">{message}</div>}
      </div>

      {selectedPlanIndex !== null && (
        <CustomerDetailsModal
          isOpen={showCustomerModal}
          onClose={handleCloseModals}
          onSubmit={handleCustomerSubmit}
          planName={plans[selectedPlanIndex].title}
          planPrice={plans[selectedPlanIndex].price}
        />
      )}

      {selectedPlanIndex !== null && customerData && (
        <PaymentFlowModal
          isOpen={showPaymentModal}
          onClose={handleCloseModals}
          onPurchase={handlePurchase}
          planName={plans[selectedPlanIndex].title}
          planPrice={plans[selectedPlanIndex].price}
          customerName={customerData.name}
          isProcessing={isProcessing}
        />
      )}
    </section>
  );
}
