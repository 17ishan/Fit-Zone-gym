import { useState } from "react";
import { Menu, X } from "lucide-react";
import GooeyNav from "./GooeyNav";

// update with your own items
const items = [
  { label: "Home", href: "#home" },
  { label: "Contact", href: "#contact" },
  { label: "Our Services", href: "#service" },
  { label: "Membership", href: "#membership" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 ">
      <div className="flex items-center justify-between px-6 py-4  backdrop-blur-3xl">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-blue-500 tracking-wide">
          <span className="text-gray-200">Fit</span>Zone
        </h1>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-gray-200 focus:outline-none"
          onClick={() => setIsOpen((s) => !s)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav — fixed & aligned right */}
        <div className="hidden md:flex justify-end items-center flex-1 text-gray-200 ">
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
        <nav className="bg-black border-t border-gray-700">
          <ul className="flex flex-col gap-2 px-4 py-4">
            {items.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-blue-400 transition-colors"
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
 