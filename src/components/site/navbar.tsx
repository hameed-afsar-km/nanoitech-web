"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/lib/site-content-context";

export default function Navbar() {
  const { content } = useSiteContent();
  const { nav } = content;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!open) return;
    const fn = () => setOpen(false);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [open]);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className={`transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}>
        <div className="wrap h-[60px] lg:h-[64px] flex items-center justify-between gap-6">
          {/* Brand */}
          <Link href="#top" className="flex items-center gap-2.5 shrink-0">
            <motion.img src="/images/brand-logo.png" alt="Nano I Technology"
              className="h-[20px] w-auto object-contain"
              whileHover={{ scale: 1.04 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} />
          </Link>

          {/* Links */}
          <nav className="hidden lg:flex items-center gap-0">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href}
                className="relative px-4 py-2 text-[12px] font-medium text-ink/50 hover:text-ink transition-colors duration-200 rounded-full hover:bg-cream-2">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.a href="#contact"
              className="btn btn-fire btn-sm hidden md:inline-flex"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {nav.cta}
            </motion.a>
            <button onClick={() => setOpen(v => !v)}
              className="lg:hidden w-9 h-9 rounded-full bg-cream-2 flex items-center justify-center text-ink/50 hover:text-ink transition-colors cursor-pointer"
              aria-label="Toggle menu">
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-line"
            >
              <div className="wrap py-6 flex flex-col gap-0.5">
                {nav.links.map((l, i) => (
                  <motion.a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="py-3 px-4 text-[14px] font-medium text-ink/50 hover:text-ink hover:bg-cream-2 rounded-xl transition-all">
                    {l.label}
                  </motion.a>
                ))}
                <a href="#contact" onClick={() => setOpen(false)}
                  className="mt-3 btn btn-fire btn-md w-full justify-center">
                  {nav.cta}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
