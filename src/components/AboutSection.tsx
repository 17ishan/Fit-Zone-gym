// src/components/AboutSection.jsx

const AboutSection = () => {
  return (
    <section className="bg-black text-white px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-white tracking-wide">
          About <span className="text-blue-500">Us</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          Welcome to <span className="text-blue-400 font-semibold">FitZone Gym</span> — Bhopal’s destination for fitness, strength, and transformation.
        </p>

        <div className="mt-10 space-y-6 text-gray-400 text-base md:text-lg leading-loose">
          <p>
            Located in the heart of the city, FitZone is more than just a workout space — it’s a community driven by motivation,
            support, and real results.
          </p>
          <p>
            Whether you're here to lose weight, build muscle, or boost your overall health, our state-of-the-art facility and expert
            trainers are here to support your journey.
          </p>
          <p>
            From early morning sessions to late-night workouts, our doors are open when you need them — offering personalized plans,
            group classes, and a motivating environment for all fitness levels.
          </p>
          <p>
            Join the <span className="text-blue-400 font-semibold">FitZone family</span> and take your first step toward a stronger, healthier you — right here in
            <span className="font-semibold text-white"> Bhopal</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
