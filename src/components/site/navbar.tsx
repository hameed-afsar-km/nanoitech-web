"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/lib/site-content-context";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const { content } = useSiteContent();
  const { nav } = content;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Track which section is in view for the active-pill indicator */
  useEffect(() => {
    const els = nav.links
      .map((l) => document.getElementById(l.href.replace(/^#/, "")))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [nav.links]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 pt-3 px-3 sm:px-5"
    >
      <div className="wrap">
        {/* Floating capsule */}
        <div
          className={`flex h-[54px] items-center justify-between gap-4 rounded-full pl-5 pr-2 transition-all duration-500 ${
            scrolled || open
              ? "glass shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              : "bg-transparent border-transparent"
          }`}
        >
          {/* Brand */}
          <Link href="#top" className="flex items-center gap-2.5 shrink-0 group">
            <motion.img
              src="/images/brand-logo.png"
              alt="Nano I Technology"
              className="h-[22px] w-auto object-contain"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
            <span className="hidden sm:block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70 group-hover:text-ink transition-colors leading-none">
              {nav.brandName}
            </span>
          </Link>

          {/* Links + active pill */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href}
                className={`relative rounded-full px-4 py-2 text-[12px] font-medium transition-colors duration-200 ${
                  active === l.href ? "text-ink" : "text-ink/45 hover:text-ink"
                }`}>
                {active === l.href && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-ink/[0.06]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.a href="#contact"
              className="btn btn-fire btn-sm hidden md:inline-flex"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {nav.cta}
            </motion.a>
            <button onClick={() => setOpen(v => !v)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-ink bg-cream-2 hover:bg-cream-3 transition-colors cursor-pointer"
              aria-label="Toggle menu" aria-expanded={open}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex">
                  {open ? <X size={17} /> : <Menu size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="lg:hidden mt-2 origin-top rounded-3xl glass shadow-[0_16px_48px_rgba(0,0,0,0.10)] overflow-hidden"
            >
              <div className="p-3">
                {nav.links.map((l, i) => (
                  <motion.a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: EASE }}
                    className={`group flex items-center gap-3 py-3 px-4 rounded-2xl transition-all ${
                      active === l.href ? "bg-cream-2 text-ink" : "text-ink/55 hover:text-ink hover:bg-cream-2"
                    }`}>
                    <span className="font-mono text-[10px] text-ink-muted w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[16px] font-medium tracking-tight">{l.label}</span>
                  </motion.a>
                ))}
                <motion.a href="#contact" onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + nav.links.length * 0.04, duration: 0.3, ease: EASE }}
                  className="mt-2 btn btn-fire btn-md w-full justify-center">
                  {nav.cta}
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
