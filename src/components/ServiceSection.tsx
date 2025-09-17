// src/components/ServiceSection.jsx
import { Dumbbell, HeartPulse, StretchHorizontal, Brain, Flame, Medal } from "lucide-react";

const services = [
  {
    icon: <Dumbbell size={40} className="text-[#FF0000]" />,
    title: "Strength Training",
    desc: "Build muscle and gain strength with expert-led weight training sessions.",
  },
  {
    icon: <HeartPulse size={40} className="text-[#FF0000]" />,
    title: "Cardio Programs",
    desc: "Boost endurance and burn fat with HIIT, treadmill runs, and cycling.",
  },
  {
    icon: <StretchHorizontal size={40} className="text-[#FF0000]" />,
    title: "Flexibility & Mobility",
    desc: "Enhance mobility, prevent injuries, and increase joint strength.",
  },
  {
    icon: <Brain size={40} className="text-[#FF0000]" />,
    title: "Mind & Wellness",
    desc: "Yoga and meditation classes to keep both your body and mind fit.",
  },
  {
    icon: <Flame size={40} className="text-[#FF0000]" />,
    title: "Fat Burn Bootcamps",
    desc: "Intense group sessions focused on maximum calorie burn and fat loss.",
  },
  {
    icon: <Medal size={40} className="text-[#FF0000]" />,
    title: "Personal Coaching",
    desc: "1-on-1 personal training tailored to your goals and fitness level.",
  },
];

const ServiceSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center justify-center">
      {/* Background Overlay (optional image if needed) */}
      <div className="absolute inset-0 -z-10 bg-[url('src/assets/service-bg.jpg')] bg-cover bg-center opacity-10" />

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
        Our <span className="text-[#FF0000]">Services</span>
      </h2>
      <p className="text-lg text-[#414141] max-w-2xl text-center mb-12">
        FitZone offers a wide range of services to help you meet your fitness goals, from strength and conditioning to mental wellness.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full px-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-[#414141]/16 backdrop-blur-sm p-6 rounded-2xl border border-[#414141]/10 hover:border-[#FF0000] transition duration-300 shadow-md hover:shadow-[#AF0404]/30"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-[#FF0000]">{service.title}</h3>
              <p className="text-[# text-sm">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSection;
