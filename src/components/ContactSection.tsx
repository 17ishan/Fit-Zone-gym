// src/components/ContactSection.jsx
import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
        Get in <span className="text-blue-500">Touch</span>
      </h2>
      <p className="text-lg text-gray-300 max-w-2xl text-center mb-12">
        Whether you have questions about memberships, want to schedule a trial session, or just want to connect — we’re here to help.
      </p>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form className="space-y-6 bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              required
              placeholder="Write your message..."
              className="w-full px-4 py-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md"
          >
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div className="space-y-6 bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
          <div className="flex items-start gap-4">
            <Phone className="text-blue-500 mt-1" />
            <div>
              <h4 className="font-semibold">Phone</h4>
              <p className="text-gray-300 text-sm">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="text-blue-500 mt-1" />
            <div>
              <h4 className="font-semibold">Email</h4>
              <p className="text-gray-300 text-sm">contact@fitzonegym.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="text-blue-500 mt-1" />
            <div>
              <h4 className="font-semibold">Location</h4>
              <p className="text-gray-300 text-sm">123 Fitness Street, Bhopal, MP</p>
            </div>
          </div>

          <div className="pt-8">
            <iframe
              title="FitZone Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.845674570282!2d77.4126!3d23.2602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43ebd7fd7dbb%3A0xa07c0141449df4a1!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-md"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
