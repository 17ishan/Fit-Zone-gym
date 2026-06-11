import { motion } from "framer-motion";
import { BlurFade } from "./magicui/blur-fade";

const galleryImages = [
  { src: "/gallery1.jpg", label: "Strength Zone", span: "lg:row-span-2" },
  { src: "/gallery2.jpg", label: "Cardio Deck", span: "" },
  { src: "/gallery3.jpg", label: "Free Weights", span: "" },
  { src: "/gallery4.jpg", label: "Functional Area", span: "" },
  { src: "/gallery5.jpg", label: "Group Studio", span: "lg:row-span-2" },
  { src: "/gallery6.jpg", label: "Recovery Lounge", span: "" },
];

const GallerySection = () => {
  return (
    <section className="bg-black py-24 px-6 font-serif" id="gallery">
      <div className="max-w-6xl mx-auto">
        <BlurFade>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF0000]">
              Take a Look
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Our <span className="text-[#FF0000]">Gallery</span>
            </h2>
            <p className="mt-4 text-gray-400">
              Step inside FitZone — premium spaces built to push you further.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[16rem] gap-5">
          {galleryImages.map((item, index) => (
            <motion.div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 shadow-lg ${item.span}`}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <img
                src={item.src}
                alt={item.label}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="rounded-full bg-[#FF0000] px-3 py-1 text-sm font-semibold text-white">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
