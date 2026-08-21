"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Mail, MessageSquare, Phone } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { GrainVeil } from "./backdrops";
import { Reveal } from "./motion";
import { ShinyButton } from "@/components/ui/shiny-button";

const PARTNER_OPTIONS = [
  { id: "aqua", label: "Aquaculture & Hatcheries", query: "Aquaculture bulk order / trial collaboration" },
  { id: "retail", label: "Retail & Distribution", query: "Retail distributor partnership" },
  { id: "rd", label: "Research & Contract R&D", query: "R&D collaboration and custom formulation" },
];

export default function CtaBand() {
  const { content } = useSiteContent();
  const { contact, footer } = content;
  const [selected, setSelected] = useState(PARTNER_OPTIONS[0]);

  const waPhone = (contact.whatsapp || footer.phone || "").replace(/[^\d]/g, "");
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hello Nano I Technology team! I'm reaching out regarding: ${selected.query}.`
  )}`;

  const rows = [
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: "Phone", value: footer.phone, href: `tel:${footer.phone.replace(/\s/g, "")}` },
    ...(contact.secondary
      ? [{ icon: ArrowUpRight, label: "Explore", value: contact.secondary.label, href: contact.secondary.href }]
      : []),
  ];

  return (
    <section id="contact" className="cta-band relative overflow-hidden lg:h-[100svh]">
      <GrainVeil opacity={0.12} />
      <style>{`
        .cta-band {
          background: linear-gradient(120deg, #d6236b, #e8720c, #2f8f4e, #d6236b);
          background-size: 300% 300%;
          animation: cta-gradient-shift 18s ease-in-out infinite;
        }
        @keyframes cta-gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="wrap relative z-10 w-full flex flex-col justify-center min-h-[100svh] lg:min-h-0 lg:h-full pt-20 lg:pt-16 pb-14 lg:pb-14">
        <Reveal>
          <div className="text-center max-w-[800px] mx-auto mb-10 lg:mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-white/70 rounded-full" />
              <span className="text-[11px] font-semibold tracking-[0.15em] text-white uppercase">Contact</span>
              <span className="w-8 h-[2px] bg-white/70 rounded-full" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-white leading-[0.98] tracking-[-0.03em]"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}>
              {contact.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 mx-auto max-w-[480px] text-[15px] text-white/75 leading-[1.8]">
              {contact.description}
            </motion.p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
          {/* Contact rows */}
          <div>
            {rows.map((r, i) => (
              <motion.a key={r.label} href={r.href}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`group flex items-center gap-5 py-4 ${i < rows.length - 1 ? "border-b border-white/15" : ""} hover:opacity-80 transition-opacity`}>
                <div className="w-12 h-12 rounded-[14px] bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                  <r.icon size={16} className="text-white/70 group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/50 mb-0.5">{r.label}</p>
                  <p className="text-[13px] text-white truncate">{r.value}</p>
                </div>
                <ArrowUpRight size={14} className="text-white/40 group-hover:text-white transition-colors ml-auto flex-shrink-0" />
              </motion.a>
            ))}
          </div>

          {/* Partner card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[20px] p-7 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)] lg:-mt-6"
          >
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-magenta" />
              <span className="section-label text-ink-muted">Partner With Us</span>
            </div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted font-medium mb-5">
              Select Your Area of Interest
            </p>
            <div className="flex flex-col mb-9">
              {PARTNER_OPTIONS.map((opt, i) => {
                const active = selected.id === opt.id;
                return (
                  <motion.button key={opt.id} onClick={() => setSelected(opt)} whileTap={{ scale: 0.99 }}
                    className={`flex items-center gap-4 px-4 py-4 text-left text-[12px] font-semibold uppercase tracking-wide cursor-pointer transition-all rounded-xl ${i < PARTNER_OPTIONS.length - 1 ? "border-b border-line" : ""} ${active ? "text-ink bg-cream-2" : "text-ink/40 hover:text-ink/70 hover:bg-cream-2/50"}`}>
                    <span className={`text-[9px] ${active ? "text-magenta" : "text-ink-muted"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {opt.label}
                    <span className="ml-auto w-1.5 h-1.5 rounded-full transition-all"
                      style={{ background: active ? "#d6236b" : "var(--color-line)" }} />
                  </motion.button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <ShinyButton href={waUrl} target="_blank" rel="noopener">
                <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide">
                  <MessageSquare size={14} /> Start a Conversation
                </span>
              </ShinyButton>
            </div>
            <motion.a
              href={`mailto:${contact.email}?subject=${encodeURIComponent(`Inquiry: ${selected.query}`)}`}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-line bg-transparent text-ink px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wide hover:bg-ink hover:text-cream transition-all rounded-full">
              <Mail size={14} /> Send via Email
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
