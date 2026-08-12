"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion";

export default function LogoStory() {
  return (
    <section className="relative py-20 overflow-hidden" id="logo-story">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/bg-logo-story.jpg)", backgroundPosition: "center 30%" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 75% at 50% 45%, rgba(253,240,206,0.92) 0%, rgba(253,240,206,0.65) 100%)",
        }}
      />
      <Reveal className="wrap relative z-[2] max-w-[1100px]">
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          src="/images/poster.jpg"
          alt="Nano I Technology brand story"
          className="w-full rounded-[14px] shadow-[0_24px_50px_-18px_rgba(28,20,8,0.25)]"
        />
      </Reveal>
    </section>
  );
}
