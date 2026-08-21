"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { TriDots } from "./geo-svg";
import { TriAurora, ContourRings, GrainVeil } from "./backdrops";
import { FloraCorners } from "./nature";
import { ShinyButton } from "@/components/ui/shiny-button";

const ease = [0.22, 1, 0.36, 1] as const;

const FEATURE_COLORS = ["#d6236b", "#e8720c", "#2f8f4e"];

/* Entrance variants — played only after the splash screen clears */
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.9, delay, ease },
  }),
};

export default function Hero({ started = true }: { started?: boolean }) {
  const { content } = useSiteContent();
  const { hero, products } = content;
  const ref = useRef<HTMLElement>(null);
  const anim = started ? "show" : "hidden";

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const featured = products.find((p) => p.id === (hero.featuredProductId ?? products[0]?.id)) ?? products[0];
  const secondary = products.find((p) => p.id !== featured?.id) ?? products[0];

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden bg-cream">
      <TriAurora />
      <ContourRings tint="magenta" tintAlt="green" />
      <FloraCorners />
      <GrainVeil />

      <motion.div style={{ opacity }} className="relative z-10 w-full pt-32 lg:pt-36 pb-24">
        <div className="wrap grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-20 items-center">

          {/* ── Content column ── */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              variants={rise} custom={0.05}
              initial="hidden" animate={anim}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-line bg-white/70 backdrop-blur-sm mb-8"
            >
              <TriDots />
              <span className="text-[11px] font-medium tracking-[0.15em] text-ink-muted uppercase">{hero.eyebrow}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={rise} custom={0.18}
              initial="hidden" animate={anim}
              className="font-display font-bold text-ink leading-[0.98] tracking-[-0.04em]"
              style={{ fontSize: "clamp(44px, 5.6vw, 84px)" }}
            >
              {hero.title1}
              <br />
              <span className="bg-gradient-to-r from-magenta via-orange to-green bg-clip-text text-transparent">
                {hero.accent1} {hero.accent2}
              </span>
            </motion.h1>

            <motion.p
              variants={rise} custom={0.34}
              initial="hidden" animate={anim}
              className="mt-7 mx-auto lg:mx-0 max-w-[500px] text-[16px] text-ink-dim leading-[1.8]"
            >
              {hero.lede}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={rise} custom={0.5}
              initial="hidden" animate={anim}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <ShinyButton href={hero.primaryCta.href}>
                <span className="inline-flex items-center gap-2">
                  {hero.primaryCta.label.replace(/→$/, "")} <ArrowRight size={14} />
                </span>
              </ShinyButton>
              <motion.a
                href={hero.secondaryCta.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-outline-dark btn-lg"
              >
                {hero.secondaryCta.label.replace(/→$/, "")} <ArrowRight size={14} />
              </motion.a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={fadeIn} custom={0.68}
              initial="hidden" animate={anim}
              className="mt-12 pt-7 hairline-t flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3"
            >
              {hero.features.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: FEATURE_COLORS[i % 3] }} />
                  <span className="text-[12px] font-medium text-ink/40">{f.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Product showcase column ── */}
          <motion.div style={{ y: yImg }} className="relative pb-10 lg:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 70, scale: 0.96 }}
              animate={started ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1.05, delay: 0.3, ease }}
              className="relative mx-auto max-w-[400px] lg:max-w-none"
            >
              {/* Featured card */}
              <div className="rounded-[28px] overflow-hidden bg-white shadow-[0_32px_80px_rgba(0,0,0,0.08)] border border-line">
                {featured?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featured.image} alt={featured.name}
                    className="w-full aspect-[4/5] object-cover" />
                ) : (
                  <div className="w-full aspect-[4/5] flex items-center justify-center font-display text-8xl font-semibold text-ink/5">
                    {featured?.name?.[0]}
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-line">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-ink truncate">{featured?.name}</p>
                    <p className="text-[12px] text-ink-muted mt-0.5">{featured?.category}</p>
                  </div>
                  <span className="tag bg-magenta-light text-magenta flex-shrink-0">Featured</span>
                </div>
              </div>

              {/* Floating secondary */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.85 }}
                animate={started ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.75, ease }}
                className="absolute -bottom-8 -left-4 sm:-left-10 w-[140px] sm:w-[170px]"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-[18px] overflow-hidden bg-white shadow-[0_16px_40px_rgba(0,0,0,0.07)] border border-line"
                >
                  {secondary?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={secondary.image} alt={secondary.name} loading="lazy" decoding="async"
                      className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center font-display text-5xl font-semibold text-ink/5">
                      {secondary?.name?.[0]}
                    </div>
                  )}
                  <p className="px-3.5 py-2.5 text-[11px] font-semibold text-ink truncate border-t border-line">
                    {secondary?.name}
                  </p>
                </motion.div>
              </motion.div>

              {/* Tri-color dots accent */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={started ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.95 }}
                className="absolute -top-7 right-6 sm:right-10"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <TriDots size="md" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Trust marquee */}
      <motion.div
        initial={{ y: "110%" }}
        animate={started ? { y: "0%" } : {}}
        transition={{ duration: 0.9, delay: 0.6, ease }}
        className="absolute bottom-0 inset-x-0 z-30 border-t border-line bg-white/80 backdrop-blur-xl overflow-hidden"
      >
        <div className="flex w-max">
          <div className="anim-marquee flex shrink-0 items-center">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {content.trustStrip.map((t, i) => (
                  <span key={i} className="flex items-center gap-2.5 px-8 py-3 text-[11px] font-medium tracking-wide text-ink/30 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 3 === 0 ? "#d6236b" : i % 3 === 1 ? "#e8720c" : "#2f8f4e" }} />
                    {t.icon} {t.text.replace(/\n/g, " ")}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
