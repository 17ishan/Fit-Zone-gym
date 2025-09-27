// src/components/MembershipSectionAlt.jsx
import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const plans = [
  {
    title: "Basic",
    price: "₹799/mo",
    features: [
      "Access to gym floor",
      "Locker room access",
      "1 Personal Trainer session",
    ],
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
  },
  {
    title: "Annual Elite",
    price: "₹24,999/year",
    features: [
      "Unlimited gym access",
      "Unlimited PT sessions",
      "Spa & recovery access",
      "Exclusive VIP events",
      "Dedicated nutritionist",
    ],
  },
];

const MembershipSectionAlt = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-black text-white py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-5xl font-bold mb-6">
          Compare Our <span className="text-[#FF0000]">Plans</span>
        </h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          Whether you’re just starting out or looking for premium perks, we have
          a membership for you. Compare and choose what fits best.
        </p>

        {/* Desktop Table */}
        <div className="hidden md:grid grid-cols-5 gap-6 bg-[#111] rounded-xl overflow-hidden">
          <div className="p-6 border-r border-gray-800">
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Gym Floor Access</li>
              <li>Locker Room</li>
              <li>Personal Trainer</li>
              <li>Group Classes</li>
              <li>Diet Consultation</li>
              <li>Massage / Recovery</li>
              <li>Priority Support</li>
              <li>Exclusive Events</li>
            </ul>
          </div>

          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-6 flex flex-col justify-between ${
                idx !== plans.length - 1 ? "border-r border-gray-800" : ""
              }`}
            >
              <div>
                <h3 className="text-xl font-bold mb-2 text-center">
                  {plan.title}
                </h3>
                <p className="text-[#FF0000] text-2xl font-extrabold mb-6 text-center">
                  {plan.price}
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="text-[#FF0000] w-5 h-5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-6 w-full bg-[#FF0000] hover:bg-[#AF0404] text-white py-2 rounded-lg transition">
                Join {plan.title}
              </button>
            </div>
          ))}
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800"
            >
              {/* Accordion Button */}
              <button
                className="w-full flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-lg">{plan.title}</span>
                {openIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#FF0000]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#FF0000]" />
                )}
              </button>
              <p className="text-[#FF0000] font-bold mt-1">{plan.price}</p>

              {/* Accordion Content with animation */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  openIndex === idx ? "max-h-96 mt-4" : "max-h-0"
                }`}
              >
                <ul className="space-y-2 text-sm text-gray-300">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="text-[#FF0000] w-4 h-4" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="mt-4 w-full bg-[#FF0000] hover:bg-[#AF0404] text-white py-2 rounded-lg transition">
                Join {plan.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSectionAlt;
