"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";
import { fadeUp, stagger } from "./motion";

const pillColors = ["bg-green", "bg-magenta", "bg-orange", "bg-purple"];

export default function Hero() {
  const { content } = useSiteContent();
  const { hero, products } = content;

  const featured = hero.featuredProductId
    ? products.find((p) => p.id === hero.featuredProductId)
    : undefined;
  const heroImg = featured?.image ?? "/images/hero.jpg";
  const heroLabel = featured?.name ?? "";

  return (
    <section
      className="relative pt-16 pb-0 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-2) 100%)",
      }}
      id="top"
    >
      {/* ambient blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(47,143,78,0.18), transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, 24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-40 right-[-6rem] w-[28rem] h-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(214,35,107,0.16), transparent 70%)" }}
        animate={{ x: [0, -26, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-8rem] left-1/3 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,114,12,0.14), transparent 70%)" }}
        animate={{ x: [0, 22, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="wrap relative grid lg:grid-cols-[1fr_0.82fr] gap-14 items-center pb-14">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="eyebrow">
            {hero.eyebrow}
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(34px,4.4vw,54px)] leading-[1.08] mb-6 text-green-deep"
          >
            {hero.title1}
            <br />
            <span className="text-orange italic">{hero.accent1}</span>{" "}
            <span className="text-magenta">{hero.accent2}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[16.5px] text-ink-dim max-w-[500px] mb-8">
            {hero.lede}
          </motion.p>

          <motion.div
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9"
          >
            {hero.features.map((f, i) => (
              <motion.div key={f.label} variants={fadeUp} className="text-left">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-[18px] text-white mb-2.5 ${pillColors[i % pillColors.length]}`}
                >
                  {f.icon}
                </div>
                <div className="text-[11.5px] font-extrabold tracking-[0.02em] text-ink uppercase leading-tight">
                  {f.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5">
            <a href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(28,20,8,0.35)] order-first lg:order-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt={heroLabel || "Nano I Technology"} className="w-full block" />
          {heroLabel && (
            <div className="absolute left-3.5 right-3.5 bottom-3.5 z-[2] bg-ink/70 text-white font-display text-[15px] py-2 px-3.5 rounded-[10px] text-center backdrop-blur-sm">
              {heroLabel}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
