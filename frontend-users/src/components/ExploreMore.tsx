import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { MorphingText } from "./magicui/morphing-text";
import { BlurFade } from "./magicui/blur-fade";
import { DotPattern } from "./magicui/dot-pattern";

const plans = [
  {
    title: "Monthly Plan",
    price: "$29",
    duration: "per month",
    perks: ["Access to all equipment", "Free group classes", "Locker facility"],
    color: "from-[#FF0000] to-[#AF0404]",
  },
  {
    title: "Quarterly Plan",
    price: "$79",
    duration: "every 3 months",
    perks: ["All Monthly perks", "1 Personal Trainer session", "Diet plan included"],
    color: "from-[#AF0404] to-[#FF0000]",
  },
  {
    title: "Yearly Plan",
    price: "$299",
    duration: "per year",
    perks: [
      "All Quarterly perks",
      "Unlimited trainer sessions",
      "Premium locker",
      "Free supplements",
    ],
    color: "from-[#FF0000] to-[#AF0404]",
  },
];

const ExploreMore = () => {
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
          <div className="text-center mb-14">
            <MorphingText
              texts={["Memberships", "Plans", "Packages"]}
              className="text-[#FFFADC]"
            />
            <p className="mt-2 text-gray-400">Find the package that moves with you.</p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <BlurFade key={index} delay={index * 0.12} className="h-full">
              <div
                className={`flex h-full flex-col rounded-2xl bg-gradient-to-br ${plan.color} p-8 shadow-lg shadow-[#FF0000]/20 transition-transform duration-300 hover:scale-[1.03]`}
              >
                <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                <p className="text-4xl font-extrabold mb-1">{plan.price}</p>
                <p className="text-sm text-gray-100/80 mb-6">{plan.duration}</p>
                <ul className="space-y-3 mb-8">
                  {plan.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 shrink-0 text-white" /> {perk}
                    </li>
                  ))}
                </ul>
                <button className="mt-auto w-full bg-black/70 hover:bg-black text-white py-3 rounded-xl font-semibold transition">
                  Choose {plan.title}
                </button>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMore;
