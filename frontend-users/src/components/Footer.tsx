import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Dumbbell,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
} from "lucide-react";
import { DotPattern } from "./magicui/dot-pattern";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#service" },
  { label: "About", href: "#about" },
  { label: "Membership", href: "#membership" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const socials = [Facebook, Instagram, Twitter, Youtube];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] text-gray-300 font-serif">
      {/* Top bar */}
      <div className="bg-[#FF0000] text-center py-4 text-white font-semibold tracking-wide">
        🔥 Push Your Limits — Train Hard, Stay Strong! 🔥
      </div>

      <DotPattern className="text-white/[0.06] [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]" />
      <div className="absolute -top-24 left-1/2 h-48 w-[40rem] -translate-x-1/2 rounded-full bg-[#FF0000]/15 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white">
              <Dumbbell className="h-5 w-5" />
            </span>
            Fit<span className="text-[#FF0000]">Zone</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
            Your journey to a healthier, stronger you starts here. Join FitZone and
            transform your body and mind.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-all hover:bg-[#FF0000] hover:ring-[#FF0000]"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-gray-400 transition hover:text-[#FF0000]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 text-gray-400">
              <MapPin className="h-5 w-5 shrink-0 text-[#FF0000]" /> Mumbai, India
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Phone className="h-5 w-5 shrink-0 text-[#FF0000]" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Mail className="h-5 w-5 shrink-0 text-[#FF0000]" /> support@fitzone.com
            </li>
          </ul>
        </div>

        {/* Newsletter / CTA */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
            Stay Updated
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            Get fitness tips & exclusive offers in your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-lg border border-gray-700 bg-[#111] px-3 py-2 text-sm outline-none focus:border-[#FF0000]"
            />
            <button className="rounded-lg bg-[#FF0000] px-4 text-sm font-semibold text-white transition hover:bg-[#AF0404]">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="relative flex flex-col items-center justify-between gap-3 border-t border-gray-800 px-6 py-6 text-center text-sm sm:flex-row max-w-6xl mx-auto">
        <span>
          © {new Date().getFullYear()} FitZone. All rights reserved. Built with ❤️ by Team
          FitZone.
        </span>
        <a
          href="#home"
          className="inline-flex items-center gap-1 text-gray-400 transition hover:text-[#FF0000]"
        >
          Back to top <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
