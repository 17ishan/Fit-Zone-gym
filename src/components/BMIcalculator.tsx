// src/components/BMICalculatorPremium.jsx
import { useState } from "react";
import { UserCheck, Heart, Activity } from "lucide-react";

const BMICalculatorPremium = () => {
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");

  const calculateBMI = () => {
    if (!weight || !height) return;

    const heightMeters = height / 100;
    const bmiValue = Number((weight / (heightMeters * heightMeters)).toFixed(1));
    setBmi(bmiValue);

    if (bmiValue < 18.5) {
      setCategory("Underweight");
      setEmoji("🏋️");
    } else if (bmiValue < 24.9) {
      setCategory("Normal");
      setEmoji("💪");
    } else if (bmiValue < 29.9) {
      setCategory("Overweight");
      setEmoji("⚡");
    } else {
      setCategory("Obese");
      setEmoji("🔥");
    }
  };

  const getProgressWidth = () => {
    if (!bmi) return "w-0";
    if (bmi < 18.5) return "w-1/5";
    if (bmi < 24.9) return "w-2/5";
    if (bmi < 29.9) return "w-3/5";
    return "w-4/5";
  };

  const getProgressColor = () => {
    if (!bmi) return "bg-gray-500";
    if (bmi < 18.5) return "bg-blue-400";
    if (bmi < 24.9) return "bg-green-400";
    if (bmi < 29.9) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-20">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#252525]/90 border border-[#414141] shadow-[0_0_40px_rgba(255,0,0,0.25)] p-8 md:p-12 overflow-hidden">
        {/* Neon Glow Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#FF0000]/30 via-[#AF0404]/20 to-[#414141]/20 blur-3xl animate-pulse -z-10"></div>

        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] via-[#AF0404] to-[#FFFADC] tracking-widest uppercase">
          BMI Calculator
        </h2>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="text-[#FF0000] font-semibold mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="Enter your weight"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-[#414141] focus:ring-2 focus:ring-[#FF0000] outline-none transition-all duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#FF0000] font-semibold mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              placeholder="Enter your height"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-[#414141] focus:ring-2 focus:ring-[#AF0404] outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={calculateBMI}
          className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-[#FF0000] to-[#AF0404] text-white font-bold hover:scale-105 transition-transform duration-300"
        >
          Calculate
        </button>

        {/* Result */}
        {bmi && (
          <div className="mt-10 text-center">
            <p className="text-2xl md:text-3xl font-bold mb-2 text-[#FF0000]">
              Your BMI: <span className="text-white drop-shadow-lg">{bmi}</span>
            </p>
            <p className="text-lg font-semibold text-gray-300 flex justify-center items-center gap-2">
              {emoji} {category}
            </p>

            {/* Animated Progress Bar */}
            <div className="relative w-full h-5 rounded-full bg-[#1c1c1c] mt-6 overflow-hidden border border-[#414141]">
              <div
                className={`h-5 rounded-full ${getProgressColor()} transition-all duration-1000`}
                style={{ width: getProgressWidth() }}
              ></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 flex items-center justify-center">
                <span className="text-white text-sm font-semibold drop-shadow-md">
                  {category}
                </span>
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-3 font-semibold">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculatorPremium;
