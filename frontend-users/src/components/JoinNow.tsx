import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Star, Zap, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BlurFade } from "./magicui/blur-fade";
import { BorderBeam } from "./magicui/border-beam";
import { DotPattern } from "./magicui/dot-pattern";
import GradientText from "./reactbits/GradientText";

const plans: {
  title: string;
  price: string;
  perks: string[];
  icon: LucideIcon;
  popular: boolean;
}[] = [
  {
    title: "Basic Plan",
    price: "$19/mo",
    perks: ["Access to gym equipment", "1 free session", "Locker access"],
    icon: Star,
    popular: false,
  },
  {
    title: "Standard Plan",
    price: "$39/mo",
    perks: ["All Basic perks", "Group classes", "Personal trainer (2x/week)"],
    icon: Zap,
    popular: true,
  },
  {
    title: "Premium Plan",
    price: "$59/mo",
    perks: [
      "All Standard perks",
      "Unlimited classes",
      "Diet consultation",
      "Priority booking",
    ],
    icon: Crown,
    popular: false,
  },
];

const JoinNow = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white py-20 px-6 font-serif">
      <DotPattern className="text-white/[0.05] [mask-image:radial-gradient(700px_circle_at_top,white,transparent)]" />
      <div className="absolute -top-24 left-1/2 h-56 w-[45rem] -translate-x-1/2 rounded-full bg-[#FF0000]/15 blur-[110px]" />

      <div className="relative max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-300 hover:text-[#FF0000] mb-8 transition"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <BlurFade>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF0000]">
              Membership
            </span>
            <h1 className="text-4xl md:text-6xl font-bold">
              Choose Your <GradientText>Plan</GradientText>
            </h1>
            <p className="mt-4 text-gray-400">
              Start today with a 7-day free trial. No credit card required.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <BlurFade key={index} delay={index * 0.12} className="h-full">
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#111] p-8 transition-transform duration-300 ${
                    plan.popular
                      ? "border-[#FF0000]/60 md:-translate-y-3 md:scale-[1.03] shadow-2xl shadow-[#FF0000]/20"
                      : "border-gray-800 hover:border-[#FF0000]/50 hover:-translate-y-1"
                  }`}
                >
                  {plan.popular && (
                    <>
                      <BorderBeam size={150} duration={8} />
                      <span className="absolute top-0 right-0 bg-[#FF0000] text-white text-sm px-3 py-1 rounded-bl-lg">
                        Popular
                      </span>
                    </>
                  )}
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF0000]/10 ring-1 ring-[#FF0000]/30">
                    <Icon className="h-7 w-7 text-[#FF0000]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                  <p className="text-3xl font-extrabold text-[#FF0000] mb-6">{plan.price}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.perks.map((perk, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 shrink-0 text-[#FF0000]" /> {perk}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-auto w-full bg-[#FF0000] hover:bg-[#AF0404] py-3 rounded-xl font-semibold transition">
                    Get Started
                  </button>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JoinNow;
