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
    else if (bmiValue >= 18.5 && bmiValue < 24.9) setCategory("💪 Normal – Keep it up!");
    else if (bmiValue >= 25 && bmiValue < 29.9) setCategory("⚡ Overweight – Time to Cut!");
    else setCategory("🔥 Obese – Let’s Smash Those Goals!");
  };

  return (
    <div className="bg-black text-white py-16 px-6 flex justify-center items-center">
      <div className="w-full max-w-lg relative rounded-3xl overflow-hidden">
        
        {/* Neon Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/40 via-indigo-600/30 to-purple-700/40 blur-3xl animate-pulse" />
        
        <div className="relative z-10 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-[0_0_25px_rgba(59,130,246,0.5)] p-8">
          
          {/* Title */}
          <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-widest uppercase">
            BMI Calculator
          </h2>

          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-300 text-sm font-semibold">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                placeholder="Enter your weight"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 text-sm font-semibold">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                placeholder="Enter your height"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={calculateBMI}
            className="w-full mt-8 relative group overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-bold tracking-wide text-lg shadow-lg shadow-blue-500/30"
          >
            <span className="relative z-10 text-white group-hover:text-yellow-300 transition-colors">
              Calculate BMI
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>

          {/* Result */}
          {bmi && (
            <div className="mt-10 text-center">
              <p className="text-2xl font-bold mb-2">
                Your BMI:{" "}
                <span className="text-cyan-400 drop-shadow-lg">{bmi}</span>
              </p>
              <p className="text-lg font-medium text-gray-300">{category}</p>

              {/* Progress bar for BMI Range */}
              <div className="w-full bg-gray-800 rounded-full h-3 mt-6 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ease-out ${
                    bmi < 18.5
                      ? "bg-yellow-400 w-1/5"
                      : bmi < 24.9
                      ? "bg-green-500 w-2/5"
                      : bmi < 29.9
                      ? "bg-orange-500 w-3/5"
                      : "bg-red-600 w-4/5"
                  }`}
                ></div>
              </div>

              {/* Labels */}
              <div className="flex justify-between text-xs text-gray-400 mt-3">
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
