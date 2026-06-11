import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "./magicui/blur-fade";
import { BorderBeam } from "./magicui/border-beam";
import GradientText from "./reactbits/GradientText";
import { submitContact } from "@/services/contact.service";

const info = [
  { icon: Mail, label: "Email Us", value: "support@fitzone.com" },
  { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
  { icon: MapPin, label: "Visit Us", value: "FitZone Gym, Mumbai, India" },
];

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitContact(formData);
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/30 outline-none transition";

  return (
    <section className="bg-[#0a0a0a] text-white py-24 px-6 font-serif" id="contact">
      <div className="max-w-6xl mx-auto">
        <BlurFade>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FF0000]">
              Contact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Get in <GradientText>Touch</GradientText>
            </h2>
            <p className="mt-4 text-gray-400">
              Have questions or want to start your fitness journey? Reach out to us!
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left - Contact Info */}
          <div className="md:col-span-2 space-y-4">
            {info.map((item, i) => (
              <BlurFade key={item.label} delay={i * 0.1}>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111] p-5 transition-colors hover:border-[#FF0000]/40">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF0000]/10 ring-1 ring-[#FF0000]/30">
                    <item.icon className="h-6 w-6 text-[#FF0000]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      {item.label}
                    </div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                </div>
              </BlurFade>
            ))}
            <BlurFade delay={0.3}>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  <Clock className="h-4 w-4 text-[#FF0000]" /> Opening Hours
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Mon – Sat</span>
                  <span>5:00 AM – 11:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Sunday</span>
                  <span>7:00 AM – 9:00 PM</span>
                </div>
              </div>
            </BlurFade>
          </div>

          {/* Right - Contact Form */}
          <BlurFade delay={0.15} className="md:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] p-8">
              <BorderBeam size={180} duration={9} />
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={inputClass}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className={inputClass}
                    required
                  />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={5}
                  className={inputClass}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FF0000] px-6 py-3 font-semibold text-white transition hover:bg-[#AF0404] disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> {submitting ? "Sending…" : "Send Message"}
                </button>

                {error && (
                  <div className="rounded-lg border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-3 text-sm font-medium text-[#FF5757]">
                    {error}
                  </div>
                )}

                <AnimatePresence>
                  {sent && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Message sent successfully! We'll get back to you soon.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
