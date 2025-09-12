// src/components/MembershipSection.jsx
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    title: "Basic",
    price: "₹799/mo",
    features: [
      "Access to gym floor",
      "Locker room access",
      "1 Personal Trainer session",
    ],
    highlight: false,
  },
  {
    title: "Standard",
    price: "₹1,499/mo",
    features: [
      "Everything in Basic",
      "Group fitness classes",
      "Diet consultation",
      "4 PT sessions/month",
    ],
    highlight: true,
  },
  {
    title: "Premium",
    price: "₹2,499/mo",
    features: [
      "Everything in Standard",
      "Unlimited PT sessions",
      "Massage & recovery zone",
      "Priority support",
    ],
    highlight: false,
  },
];

const MembershipSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
        Choose Your <span className="text-blue-500">Membership</span>
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl text-center mb-12">
        Pick the plan that best suits your goals and lifestyle. No hidden fees, cancel anytime.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-center bg-white/5 backdrop-blur-md p-8 rounded-2xl border ${
              plan.highlight
                ? "border-blue-500 shadow-xl"
                : "border-white/10"
            } transition duration-300`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
            )}

            <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
            <p className="text-blue-400 text-3xl font-bold mb-6">{plan.price}</p>

            <ul className="space-y-3 text-sm text-gray-300 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="text-green-400 w-5 h-5" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              Join {plan.title}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MembershipSection;
