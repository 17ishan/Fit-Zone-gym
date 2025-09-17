// src/components/MembershipSection.jsx
import { useRef } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

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
  {
    title: "Student Plan",
    price: "₹599/mo",
    features: [
      "Access to gym floor (off-peak hours)",
      "Locker room access",
      "Discounted PT sessions",
    ],
    highlight: false,
  },
  {
    title: "Family Pack",
    price: "₹3,999/mo",
    features: [
      "Access for 3 family members",
      "Group classes for all",
      "Shared diet consultation",
      "2 PT sessions per member",
    ],
    highlight: false,
  },
  {
    title: "Corporate Wellness",
    price: "₹6,999/mo",
    features: [
      "10 employee memberships",
      "Dedicated fitness consultant",
      "Weekly group fitness workshops",
      "Monthly health reports",
    ],
    highlight: false,
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
    highlight: true,
  },
];

const MembershipSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      // Scroll by card width + gap on mobile, larger amount on desktop
      const scrollAmount = window.innerWidth < 768 ? 200 : 340;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      // Scroll by card width + gap on mobile, larger amount on desktop
      const scrollAmount = window.innerWidth < 768 ? 200 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white px-4 md:px-6 py-24 flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 tracking-tight">
        Choose Your <span className="text-[#FF0000]">Membership</span>
      </h2>
      <p className="text-base md:text-lg text-[#414141] max-w-2xl text-center mb-12 px-4">
        Pick the plan that best suits your goals and lifestyle. No hidden fees, cancel anytime.
      </p>

      {/* Scroll buttons */}
      <div className="relative w-full max-w-7xl">
        <button
          onClick={scrollLeft}
          className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-[#FF0000] hover:bg-[#AF0404] text-white p-2 rounded-full shadow-lg transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-[#FF0000] hover:bg-[#AF0404] text-white p-2 rounded-full shadow-lg transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-scroll scroll-smooth scrollbar-hidden  "
        >
          <div className="flex gap-3 md:gap-6 lg:gap-20 px-8 md:px-10 border-black ">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`
                  flex-shrink-0
                  w-44 sm:w-52 md:w-72 lg:w-80 overflow-y-hidden 
                  relative flex flex-col items-center 
                  bg-[#414141]/24 backdrop-blur-md 
                  p-4 sm:p-6 md:p-8 
                  rounded-xl md:rounded-2xl 
                  border ${
                    plan.highlight
                      ? "border-[#FF0000] shadow-lg shadow-[#FF0000]/20"
                      : "border-[#414141]/10"
                  } 
                  transition-all duration-300 hover:scale-101 hover:border-[#AF0404] 
                `}
              >
                {plan.highlight && (
                  <div className="absolute -top-3  left-1/2 -translate-x-1/2 bg-[#FF0000] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </div>
                )}

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-center">
                  {plan.title}
                </h3>
                <p className="text-[#FF0000] text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                  {plan.price}
                </p>

                <ul className="space-y-2 md:space-y-3 text-xs sm:text-sm  mb-6 md:mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="text-[#FF0000] w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-[#FF0000] hover:bg-[#AF0404] text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors duration-300 text-sm md:text-base">
                  Join {plan.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default MembershipSection;
