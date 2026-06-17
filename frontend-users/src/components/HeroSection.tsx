import { Star, Users, Zap, ChevronDown, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useJoinFlow } from "@/hooks/useJoinFlow";
import { MorphingText } from "./magicui/morphing-text";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";
import { BlurFade } from "./magicui/blur-fade";
import { NumberTicker } from "./magicui/number-ticker";
import { AnimatedShinyText } from "./magicui/animated-shiny-text";
import { DotPattern } from "./magicui/dot-pattern";
import { Meteors } from "./magicui/meteors";
import GradientText from "./reactbits/GradientText";
import SpotlightCard from "./reactbits/SpotlightCard";
import gymMain from "@/assets/gymMain.jpg";

const stats = [
  { value: 5000, suffix: "+", label: "Members" },
  { value: 50, suffix: "+", label: "Trainers" },
  { value: 100, suffix: "+", label: "Classes" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const handleJoin = useJoinFlow();

  // 🔹 Interactive parallax — background image drifts opposite the cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const bgX = useTransform(springX, [-0.5, 0.5], ["18px", "-18px"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["18px", "-18px"]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["35%", "65%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["25%", "55%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,0,0,0.28), transparent 55%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-black font-serif"
    >
      {/* 🔹 Parallax background image (replaces the heavy video) */}
      <motion.div
        className="absolute inset-0 scale-110 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${gymMain})`,
          x: bgX,
          y: bgY,
        }}
      />

      {/* 🔹 Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95" />
      <motion.div className="absolute inset-0" style={{ background: glare }} />
      <DotPattern className="text-white/10 [mask-image:radial-gradient(750px_circle_at_center,white,transparent)]" />
      <Meteors number={14} className="bg-[#FF0000]/70" />

      {/* 🔹 Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <BlurFade delay={0.1}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-[#FF0000]" />
            <AnimatedShinyText className="text-sm text-[#FFFADC]/80">
              #1 Rated Fitness Club in the City
            </AnimatedShinyText>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="mb-1 text-sm md:text-base font-sans uppercase tracking-[0.35em] text-gray-300">
            Welcome to FitZone
          </p>
        </BlurFade>

        <BlurFade delay={0.3}>
          <MorphingText
            texts={["Get Fit", "Stay Strong", "Train Hard", "Be Unstoppable"]}
            className="text-[#FFFADC] !h-16 md:!h-24 text-4xl md:text-6xl whitespace-nowrap"
          />
        </BlurFade>

        <BlurFade delay={0.45}>
          <h2 className="mt-3 text-xl md:text-3xl font-bold tracking-tight">
            <span className="text-gray-200">Where </span>
            <GradientText className="font-extrabold">Strength</GradientText>
            <span className="text-gray-200"> Meets </span>
            <GradientText className="font-extrabold">Discipline</GradientText>
          </h2>
        </BlurFade>

        <BlurFade delay={0.5}>
          <p className="mt-4 text-base md:text-xl text-gray-300 max-w-xl">
            Transform your body, elevate your mind, and unleash your true potential.
          </p>
        </BlurFade>

        {/* 🔹 Buttons */}
        <BlurFade delay={0.55}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <InteractiveHoverButton
              onClick={handleJoin}
              className="bg-[#FF0000] text-white border-none hover:bg-[#AF0404]"
            >
              Join Now
            </InteractiveHoverButton>

            <InteractiveHoverButton
              onClick={() => navigate("/explore")}
              className="bg-transparent border border-white text-white hover:bg-white hover:text-black"
            >
              Explore More
            </InteractiveHoverButton>
          </div>
        </BlurFade>

        {/* 🔹 Interactive stat cards */}
        <BlurFade delay={0.7}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {stats.map((s) => (
              <SpotlightCard
                key={s.label}
                className="group h-32 w-32 sm:w-40 bg-white/5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-[#FF0000]/40"
              >
                <div className="flex h-full w-full flex-col items-center justify-center px-3 text-center">
                  <Dumbbell className="mb-2 h-5 w-5 text-[#FF0000] transition-transform duration-300 group-hover:scale-125" />
                  <div className="flex items-baseline justify-center whitespace-nowrap text-3xl sm:text-4xl font-bold text-[#FFFADC]">
                    <NumberTicker value={s.value} />
                    <span className="text-[#FF0000]">{s.suffix}</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-gray-400">{s.label}</div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.85}>
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-300">
            <Star className="h-4 w-4 fill-[#FF0000] text-[#FF0000]" />
            4.9/5 from 1,200+ reviews
            <span className="mx-2 text-gray-600">|</span>
            <Users className="h-4 w-4 text-[#FF0000]" />
            5,000+ active members
          </div>
        </BlurFade>
      </div>

      {/* 🔹 Scroll cue */}
      <motion.a
        href="#service"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60 hover:text-[#FF0000] transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        aria-label="Scroll down"
      >
        <ChevronDown className="h-7 w-7" />
      </motion.a>
    </section>
  );
};

export default HeroSection;
