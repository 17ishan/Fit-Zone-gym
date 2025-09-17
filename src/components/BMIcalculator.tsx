import { useState } from "react";

const BMICalculator = () => {
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  const calculateBMI = () => {
    if (!weight || !height) return;

    const heightInMeters = height / 100;
    const bmiValue = Number(
      (weight / (heightInMeters * heightInMeters)).toFixed(2)
    );
    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory("🏋️ Underweight – Time to Bulk Up!");
    else if (bmiValue >= 18.5 && bmiValue < 24.9)
      setCategory("💪 Normal – Keep it up!");
    else if (bmiValue >= 25 && bmiValue < 29.9)
      setCategory("⚡ Overweight – Time to Cut!");
    else setCategory("🔥 Obese – Let’s Smash Those Goals!");
  };

  const getProgressColor = () => {
    if (!bmi) return "";
    if (bmi < 18.5) return "bg-[#414141]";
    if (bmi < 24.9) return "bg-[#00FF7F]"; // green for normal
    if (bmi < 29.9) return "bg-[#FFD700]"; // yellow for overweight
    return "bg-[#FF0000]"; // red for obese
  };

  const getProgressWidth = () => {
    if (!bmi) return "w-0";
    if (bmi < 18.5) return "w-1/5";
    if (bmi < 24.9) return "w-2/5";
    if (bmi < 29.9) return "w-3/5";
    return "w-4/5";
  };

  return (
    <div className="bg-black text-white py-20 px-6 flex justify-center items-center">
      <div className="w-full max-w-lg relative rounded-3xl overflow-hidden">
        {/* Neon Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/40 via-[#AF0404]/30 to-[#414141]/30 blur-3xl animate-pulse" />

        <div className="relative z-10 bg-[#252525]/90 backdrop-blur-md border border-[#414141] rounded-3xl shadow-[0_0_25px_rgba(255,0,0,0.25)] p-10 transition-transform duration-500 hover:scale-[1.02]">
          {/* Title */}
          <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#FF0000] via-[#AF0404] to-[#414141] bg-clip-text text-transparent tracking-widest uppercase">
            BMI Calculator
          </h2>

          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-[#FF0000] text-sm font-semibold">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                placeholder="Enter your weight"
                className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white placeholder-[#414141] border border-[#414141] focus:ring-2 focus:ring-[#FF0000] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#FF0000] text-sm font-semibold">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                placeholder="Enter your height"
                className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white placeholder-[#414141] border border-[#414141] focus:ring-2 focus:ring-[#AF0404] outline-none transition-all"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={calculateBMI}
            className="w-full mt-10 relative group overflow-hidden bg-[#FF0000] py-3 rounded-lg font-bold tracking-wide text-lg  transition-all duration-500"
          >
            <span className="relative z-10 text-white ">
              Calculate BMI
            </span>
            <div className="absolute inset-0 bg-[#FF0000] opacity-0 hover:bg-[#AF0404] transition-opacity duration-500 cursor-pointer" />
          </button>

          {/* Result */}
          {bmi && (
            <div className="mt-12 text-center">
              <p className="text-2xl font-bold mb-2">
                Your BMI:{" "}
                <span className="text-[#FF0000] drop-shadow-lg">{bmi}</span>
              </p>
              <p className="text-lg font-medium text-gray-300">{category}</p>

              {/* Progress bar for BMI Range */}
              <div className="w-full bg-[#1c1c1c] rounded-full h-4 mt-6 overflow-hidden border border-[#414141]">
                <div
                  className={`h-4 rounded-full transition-all duration-700 ease-out ${getProgressColor()} ${getProgressWidth()}`}
                ></div>
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
    </div>
  );
};

export default BMICalculator;
