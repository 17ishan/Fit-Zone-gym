// import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, ShieldCheck } from "lucide-react";
import { MorphingText } from "@/components/magicui/morphing-text";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";


const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center text-white px-6 pt-32 pb-32 ">
      {/* Background image that starts from top and stays behind navbar */}
      <div className="  fixed inset-0 -z-10">
        {/* <img
          src="src/assets/gymMain.jpg"
          alt="gym background"
          className="w-full h-full object-cover"
        /> */}

        <video
          src="vid1.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="absolute inset-0 bg-[#252525]/20" />
      </div>

      <h2 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg tracking-tight">
        Transform Your Body at <MorphingText className="text-[#FF0000]" texts={["Fit", "Zone"]} />
      </h2>

      <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white">
        Join the best fitness community and achieve your dream physique with expert guidance, personalized plans, and top-notch facilities.
      </p>

      <div className="flex gap-4 flex-wrap justify-center mb-10 text-[#FF0000] ">
        <InteractiveHoverButton>Join Now</InteractiveHoverButton>

        <InteractiveHoverButton>Explore Plans</InteractiveHoverButton>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-5xl">
        <div className="flex flex-col items-center">
          <Dumbbell size={40} className="text-[#FF0000] mb-2" />
          <h3 className="text-xl font-semibold text-[#FF0000]">Modern Equipment</h3>
          <p className="text-sm mt-1">
            Train with the latest fitness machines and tools.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Clock size={40} className="text-[#FF0000] mb-2" />
          <h3 className="text-xl font-semibold text-[#FF0000]">Flexible Timing</h3>
          <p className="text-sm mt-1">
            Open early till late, we fit your schedule.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck size={40} className="text-[#FF0000] mb-2" />
          <h3 className="text-xl font-semibold text-[#FF0000]">Certified Trainers</h3>
          <p className="text-sm mt-1">
            Get guidance from experienced professionals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
