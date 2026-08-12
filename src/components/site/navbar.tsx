"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSiteContent } from "@/lib/site-content-context";

export default function Navbar() {
  const { content } = useSiteContent();
  const [open, setOpen] = useState(false);
  const { nav } = content;

  return (
    <header className="sticky top-0 z-50">
      <div className="grad-magenta text-white text-[12.5px] py-2.5">
        <div className="wrap overflow-hidden">
          <div className="animate-marquee flex w-max gap-20 whitespace-nowrap">
            {[...content.utilityBar.items, ...content.utilityBar.items].map((item, i) => (
              <span key={i} className="opacity-95">{item}</span>
            ))}
            <span className="opacity-95">{content.utilityBar.follow}</span>
          </div>
        </div>
      </div>

      <nav className="bg-white/90 backdrop-blur-md border-b border-line py-3.5">
        <div className="wrap flex items-center justify-between gap-7">
          <Link href="#top" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand-logo.png" alt="Nano I Technology" className="h-11 w-auto" />
            <span className="leading-tight">
              <span className="block font-display text-[16.5px] tracking-[0.01em] text-magenta-deep font-bold">
                {nav.brandName}
              </span>
              <span className="block text-[10px] tracking-[0.05em] uppercase text-orange-deep font-bold">
                {nav.brandTag}
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex gap-8 text-[13.5px] font-bold">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className="text-ink/75 hover:text-ink hover:text-magenta-deep transition-opacity">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden sm:inline-flex grad-orange-magenta text-white px-6 py-2.5 text-[13px] font-bold rounded-[24px] hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(214,35,107,0.35)] transition-all whitespace-nowrap">
              {nav.cta}
            </a>
            <button
              className="lg:hidden p-2 text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-line bg-white"
            >
              <div className="wrap py-4 flex flex-col gap-3">
                {nav.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-[14px] font-bold text-ink/80 hover:text-magenta-deep"
                  >
                    {l.label}
                  </a>
                ))}
                <a href="#contact" onClick={() => setOpen(false)} className="grad-orange-magenta text-white text-center px-6 py-3 text-[13px] font-bold rounded-[24px]">
                  {nav.cta}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
