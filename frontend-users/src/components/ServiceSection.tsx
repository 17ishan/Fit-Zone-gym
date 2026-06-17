import {
  Dumbbell,
  HeartPulse,
  StretchHorizontal,
  Brain,
  Flame,
  Medal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BlurFade } from "./magicui/blur-fade";
import SpotlightCard from "./reactbits/SpotlightCard";
import { TiltCard } from "./ui/tilt-card";

const services: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Dumbbell,
    title: "Strength Training",
    description:
      "Build muscle and increase your power with our state-of-the-art equipment and expert guidance.",
  },
  {
    icon: HeartPulse,
    title: "Cardio Fitness",
    description:
      "Boost your stamina and heart health with our wide range of cardio machines and classes.",
  },
  {
    icon: StretchHorizontal,
    title: "Yoga & Flexibility",
    description:
      "Improve flexibility and find your inner peace with our calming yoga sessions.",
  },
  {
    icon: Brain,
    title: "Mental Wellness",
    description:
      "Strengthen your mind and reduce stress with guided meditation and wellness programs.",
  },
  {
    icon: Flame,
    title: "Fat Burning",
    description:
      "Achieve your weight loss goals with high-intensity interval training programs.",
  },
  {
    icon: Medal,
    title: "Personal Coaching",
    description:
      "Get personalized attention and custom workout plans from our certified trainers.",
  },
];

const ServiceSection = () => {
  return (
    <section className="bg-black text-white py-24 px-6 font-serif" id="service">
      <div className="max-w-6xl mx-auto">
        <BlurFade>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF0000]">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Our <span className="text-[#FF0000]">Services</span>
            </h2>
            <p className="mt-4 text-gray-400">
              Everything you need to train smarter, recover better, and reach your goals.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <BlurFade key={service.title} delay={index * 0.08} className="h-full">
                <TiltCard glare className="h-full rounded-2xl">
                  <SpotlightCard className="group h-full !bg-[#111] !border-white/10 p-8 text-center hover:!border-[#FF0000]/50">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF0000]/10 ring-1 ring-[#FF0000]/30 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-8 w-8 text-[#FF0000]" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                  </SpotlightCard>
                </TiltCard>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
