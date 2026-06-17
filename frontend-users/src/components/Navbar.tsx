import { useState, useEffect } from "react";
import { Menu, X, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import GooeyNav from "./GooeyNav";
import AuthButton from "./AuthButton";
import { MagneticButton } from "./ui/magnetic-button";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#service" },
  { label: "About", href: "#about" },
  { label: "Membership", href: "#membership" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 font-serif"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white transition-transform group-hover:rotate-12">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-2xl font-bold text-[#FFFADC]">
            Fit<span className="text-[#FF0000]">Zone</span>
          </span>
        </button>

        {/* Desktop Menu - GooeyNav */}
        <div className="hidden md:block">
          <GooeyNav items={navItems} />
        </div>

        {/* Desktop CTA + Auth */}
        <div className="hidden md:flex items-center gap-3">
          <AuthButton />
          <MagneticButton
            onClick={() => navigate("/join")}
            className="rounded-full bg-[#FF0000] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#AF0404]"
          >
            Join Now
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-black/95"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-white transition hover:bg-white/5 hover:text-[#FF0000]"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  navigate("/join");
                  setIsOpen(false);
                }}
                className="mt-2 w-full rounded-lg bg-[#FF0000] py-2.5 font-semibold text-white transition hover:bg-[#AF0404]"
              >
                Join Now
              </button>
              <div className="mt-3 flex justify-center">
                <AuthButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
