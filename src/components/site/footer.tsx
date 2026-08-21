"use client";
import { motion } from "framer-motion";
import { ArrowUp, Mail, MessageSquare } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { GradientBar, TriDots } from "./geo-svg";

const EXPLORE_LINKS: [string, string][] = [
  ["The Company", "#about"],
  ["Brand Heritage", "#story"],
  ["Nanotechnology", "#technology"],
  ["Retail Pricing", "#pricing"],
  ["Partner Inquiries", "#contact"],
];

export default function Footer() {
  const { content } = useSiteContent();
  const { footer, nav, products } = content;

  const waPhone = (content.contact.whatsapp || footer.phone || "").replace(/[^\d]/g, "");
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    "Hi Nano I Technology! I'd like to know more about your products."
  )}`;

  return (
    <footer className="relative bg-ink overflow-hidden">
      <GradientBar />

      <div className="wrap pt-14 lg:pt-20 pb-10">
        {/* Closing headline */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-display font-bold text-cream leading-[1.05] tracking-[-0.02em] max-w-[700px] mx-auto"
            style={{ fontSize: "clamp(26px, 4vw, 48px)" }}>
            Nature&rsquo;s signals,{" "}
            <span className="grad-text-loop grad-text-loop-bright">engineered at the nanoscale</span>.
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <motion.a href={waUrl} target="_blank" rel="noopener"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn btn-fire btn-md">
              <MessageSquare size={14} /> WhatsApp Us
            </motion.a>
            <motion.a href={`mailto:${footer.email}`}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn btn-on-dark btn-md">
              <Mail size={14} /> Email Us
            </motion.a>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 mb-12 lg:mb-16">
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 mb-5">Formulations</h4>
            <ul className="flex flex-col gap-3">
              {products.map((p) => (
                <li key={p.id}>
                  <a href="#products" className="text-[13px] text-cream/65 hover:text-magenta-light transition-colors duration-200">{p.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 mb-5">Explore</h4>
            <ul className="flex flex-col gap-3">
              {EXPLORE_LINKS.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-[13px] text-cream/65 hover:text-magenta-light transition-colors duration-200">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[13px] text-cream/65 hover:text-magenta-light transition-colors duration-200">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 mb-5">Contact &amp; R&amp;D</h4>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${footer.email}`} className="text-[13px] text-cream/65 hover:text-magenta-light transition-colors flex items-center gap-2">
                <Mail size={12} className="text-cream/40" />
                <span className="break-all">{footer.email}</span>
              </a>
              <div className="flex items-center gap-2 mt-2">
                <TriDots size="sm" />
                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-cream/40 ml-1">
                  Siddha Wisdom · Modern Nano
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cream/40">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 text-center sm:text-left">
            <span>{footer.copyright}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="max-w-[480px] leading-relaxed">{footer.disclaimer}</span>
          </div>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -2 }}
            className="flex items-center gap-1.5 text-cream/50 hover:text-cream transition-colors cursor-pointer">
            <span className="text-[9px] uppercase tracking-wider font-medium">Back to top</span>
            <ArrowUp size={11} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
