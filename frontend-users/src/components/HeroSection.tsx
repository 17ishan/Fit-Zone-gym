import { Star, Users, Zap, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MorphingText } from "./magicui/morphing-text";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";
import { BlurFade } from "./magicui/blur-fade";
import { NumberTicker } from "./magicui/number-ticker";
import { AnimatedShinyText } from "./magicui/animated-shiny-text";
import { DotPattern } from "./magicui/dot-pattern";

const stats = [
  { value: 5000, suffix: "+", label: "Members" },
  { value: 50, suffix: "+", label: "Trainers" },
  { value: 100, suffix: "+", label: "Classes" },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen overflow-hidden font-serif">
      {/* 🔹 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/vid1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,0,0,0.22),transparent_60%)]" />
      <DotPattern className="text-white/10 [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]" />

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
          <MorphingText
            texts={["Welcome", "To FitZone", "Get Fit", "Stay Strong"]}
            className="text-[#FFFADC]"
          />
        </BlurFade>

        <BlurFade delay={0.4}>
          <p className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl">
            Transform your body, elevate your mind, and unleash your true potential.
          </p>
        </BlurFade>

        {/* 🔹 Buttons */}
        <BlurFade delay={0.55}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <InteractiveHoverButton
              onClick={() => navigate("/join")}
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

        {/* 🔹 Stats strip */}
        <BlurFade delay={0.7}>
          <div className="mt-12 flex items-center gap-6 sm:gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-[#FFFADC]">
                  <NumberTicker value={s.value} />
                  <span className="text-[#FF0000]">{s.suffix}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-400">{s.label}</div>
              </div>
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
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60"
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
