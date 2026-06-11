import { useState } from "react";
import { Activity, Ruler, Weight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "./magicui/blur-fade";
import { BorderBeam } from "./magicui/border-beam";
import GradientText from "./reactbits/GradientText";

const categories = [
  { label: "Underweight", max: 18.5, color: "text-sky-400", range: "< 18.5" },
  { label: "Normal weight", max: 25, color: "text-green-400", range: "18.5 – 24.9" },
  { label: "Overweight", max: 30, color: "text-amber-400", range: "25 – 29.9" },
  { label: "Obese", max: Infinity, color: "text-[#FF5757]", range: "30+" },
];

const BMIcalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const roundedBmi = parseFloat(bmiValue.toFixed(1));

    setBmi(roundedBmi);

    if (roundedBmi < 18.5) setCategory("Underweight");
    else if (roundedBmi < 25) setCategory("Normal weight");
    else if (roundedBmi < 30) setCategory("Overweight");
    else setCategory("Obese");
  };

  const activeCat = categories.find((c) => c.label === category);
  const pct = bmi !== null ? Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100)) : 0;

  return (
    <section
      className="relative bg-black text-white py-24 px-6 font-serif overflow-hidden"
      id="bmi"
    >
      {/* 🔹 Neon gradient glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-gradient-to-r from-[#FF0000]/30 via-[#AF0404]/20 to-[#414141]/20 blur-3xl rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <BlurFade>
          <div className="mb-8 text-center">
            <span className="mb-3 inline-block rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF0000]">
              Health Check
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              BMI <GradientText>Calculator</GradientText>
            </h2>
          </div>
        </BlurFade>

        <BlurFade delay={0.12}>
          <div className="relative overflow-hidden rounded-2xl border border-[#FF0000]/40 bg-[#111]/80 p-10 shadow-[0_0_25px_rgba(255,0,0,0.4)] backdrop-blur-xl">
            <BorderBeam size={150} duration={8} />
            <div className="space-y-5">
              <div className="relative">
                <Ruler className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FF0000]" />
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl border border-gray-600 bg-black/60 py-3 pl-12 pr-4 text-white outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/30"
                />
              </div>
              <div className="relative">
                <Weight className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FF0000]" />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-xl border border-gray-600 bg-black/60 py-3 pl-12 pr-4 text-white outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/30"
                />
              </div>

              <button
                onClick={calculateBMI}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF0000] to-[#AF0404] py-3 font-semibold transition-transform hover:scale-[1.02]"
              >
                <Activity className="h-5 w-5" /> Calculate BMI
              </button>
            </div>

            <AnimatePresence>
              {bmi !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 text-center">
                    <div className="text-6xl font-bold">{bmi}</div>
                    <div className={`mt-1 text-lg font-semibold ${activeCat?.color}`}>
                      {category}
                    </div>

                    {/* Gauge */}
                    <div className="relative mt-6 h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-green-400 to-[#FF5757]">
                      <motion.div
                        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-black bg-white shadow-lg"
                        initial={{ left: "0%" }}
                        animate={{ left: `calc(${pct}% - 10px)` }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-gray-500">
                      <span>10</span>
                      <span>25</span>
                      <span>40</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BlurFade>

        {/* Reference table */}
        <BlurFade delay={0.2}>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-white/10 bg-[#111]/60 p-3 text-center"
              >
                <div className={`text-sm font-bold ${c.color}`}>{c.label}</div>
                <div className="mt-1 text-xs text-gray-500">{c.range}</div>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default BMIcalculator;
