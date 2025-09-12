// src/components/GallerySection.jsx
import { motion } from "framer-motion";

const galleryImages = [
  "src/assets/gallery1.jpg",
  "src/assets/gallery2.jpg",
  "src/assets/gallery3.jpg",
  "src/assets/gallery6.jpg",
  "src/assets/gallery4.jpg",
  "src/assets/gallery5.jpg",
];



const GallerySection = () => {
  return (
    <section className="relative  w-full min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center justify-center" >
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
        Gym <span className="text-blue-500">Gallery</span>
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl text-center mb-12">
        Take a sneak peek into our facilities, training areas, and energy-filled environment.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {galleryImages.map((src, i) => (
          <motion.div
            key={i}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            
          >
            <img
              src={src}
              alt={`gallery-${i}`}
              className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
