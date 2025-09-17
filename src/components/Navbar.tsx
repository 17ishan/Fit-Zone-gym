import { useState } from "react";
import { Menu, X } from "lucide-react";
import GooeyNav from "./GooeyNav";

// update with your own items
const items = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Our Services", href: "#service" },
  { label: "Membership", href: "#membership" },
  { label: "Gallery", href: "#gallery" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between px-6 py-4  backdrop-blur-3xl bg-black">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-wide">
          <span className="text-[#414141]">Fit</span><span className="text-[#FF0000]">Zone</span>
        </h1>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-[#AF0404] focus:outline-none"
          onClick={() => setIsOpen((s) => !s)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav — fixed & aligned right */}
        <div className="hidden md:flex justify-end items-center flex-1 text-[#414141] ">
          <GooeyNav
            items={items}
            particleCount={150}
            particleDistances={[90, 10]}
            particleR={10000}
            initialActiveIndex={0}
            animationTime={400}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden transition-[max-height,opacity] duration-200 overflow-hidden ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="bg-[#252525] border-t border-[#414141]">
          <ul className="flex flex-col gap-2 px-4 py-4">
            {items.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#FF0000] hover:text-[#AF0404] transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
