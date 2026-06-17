import { useRef } from "react";
import { CheckCircle2, Trophy, Users, Dumbbell, HeartPulse } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { BlurFade } from "./magicui/blur-fade";
import { BorderBeam } from "./magicui/border-beam";
import { NumberTicker } from "./magicui/number-ticker";
import GradientText from "./reactbits/GradientText";
import { useInteractivityEnabled } from "@/hooks/useInteractivityEnabled";

const highlights = [
  "World-class equipment & facilities",
  "Certified, passionate trainers",
  "A community that pushes you forward",
  "Programs for every level & goal",
];

const stats = [
  { icon: Users, value: 5000, suffix: "+", label: "Happy Members" },
  { icon: Trophy, value: 50, suffix: "+", label: "Expert Trainers" },
  { icon: Dumbbell, value: 100, suffix: "+", label: "Weekly Classes" },
  { icon: HeartPulse, value: 15, suffix: "+", label: "Years Strong" },
];

const AboutSection = () => {
  const interactive = useInteractivityEnabled();
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageWrapRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="bg-[#0a0a0a] text-[#FFFADC] py-24 px-6 font-serif" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <BlurFade>
            <div
              ref={imageWrapRef}
              className="relative overflow-hidden rounded-3xl border border-white/10"
            >
              <motion.img
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200"
                alt="Inside FitZone gym"
                style={interactive ? { y: imageY, scale: 1.12 } : undefined}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <BorderBeam size={170} duration={8} />
              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-black/70 px-5 py-3 backdrop-blur-md">
                <div className="text-3xl font-bold text-[#FF0000]">
                  <NumberTicker value={15} />+
                </div>
                <div className="text-xs text-gray-300">Years of excellence</div>
              </div>
            </div>
          </BlurFade>

          {/* Text */}
          <div>
            <BlurFade delay={0.1}>
              <span className="mb-3 inline-block rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF0000]">
                About Us
              </span>
            </BlurFade>
            <BlurFade delay={0.18}>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Where Strength Meets <GradientText>Community</GradientText>
              </h2>
            </BlurFade>
            <BlurFade delay={0.26}>
              <p className="mt-5 text-lg text-gray-300 leading-relaxed">
                At <span className="text-[#FF0000] font-semibold">FitZone</span>, fitness
                isn't just about lifting weights — it's about lifting your life. Our mission
                is to help you become the strongest version of yourself, physically and
                mentally.
              </p>
            </BlurFade>
            <BlurFade delay={0.34}>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Founded with a passion for health and personal growth, we offer world-class
                equipment, certified trainers, and a motivating environment whether you're
                just starting out or you're a seasoned athlete.
              </p>
            </BlurFade>
            <BlurFade delay={0.42}>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-gray-200">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#FF0000]" />
                    {h}
                  </li>
                ))}
              </ul>
            </BlurFade>
          </div>
        </div>

        {/* Stats band */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <BlurFade key={s.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="mb-3 inline-flex rounded-2xl bg-[#FF0000]/10 p-4 ring-1 ring-[#FF0000]/30">
                  <s.icon className="h-7 w-7 text-[#FF0000]" />
                </div>
                <div className="text-4xl font-bold">
                  <NumberTicker value={s.value} />
                  <span className="text-[#FF0000]">{s.suffix}</span>
                </div>
                <div className="mt-1 text-sm text-gray-400">{s.label}</div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
