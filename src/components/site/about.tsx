"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useSiteContent } from "@/lib/site-content-context";
import { Reveal } from "./motion";
import { ContourRings, LeafWash } from "./backdrops";
import { MissionSection, VisionSection } from "./mission-vision";
import { Lightbox } from "./lightbox";

const STAT_COLORS = ["#2f8f4e", "#d6236b", "#e8720c", "#c9971f"];

function CountUp({ value, color }: { value: string; color: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="font-display font-bold leading-none tracking-[-0.04em]"
      style={{ color, fontSize: "clamp(44px, 5vw, 72px)" }}
    >
      {value}
    </motion.span>
  );
}

export default function About() {
  const { content } = useSiteContent();
  const { about } = content;
  const [zoom, setZoom] = useState(false);

  return (
    <>
      {/* ── Stats Section (Light) ─────────────────────────── */}
      <section id="about" className="relative bg-green-light overflow-hidden">
        <LeafWash />
        <div className="wrap relative z-10 py-16 lg:py-20">
          <Reveal>
            <div className="text-center max-w-[800px] mx-auto mb-10 lg:mb-14">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-green rounded-full" />
                <span className="text-[11px] font-semibold tracking-[0.15em] text-green uppercase">About</span>
                <span className="w-8 h-[2px] bg-green rounded-full" />
              </div>
              <h2 className="font-display font-bold text-ink leading-[0.98] tracking-[-0.03em]"
                style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}>
                Nature, nanotechnology
                <br />
                <span className="grad-text-loop">&amp; 20+ years of research</span>
              </h2>
              <p className="mt-8 mx-auto max-w-[520px] text-[15px] text-ink-dim leading-[1.8]">
                {about.description}
              </p>
            </div>
          </Reveal>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1000px] mx-auto">
            {about.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="text-center p-8 bg-white rounded-[20px] border border-line shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <CountUp value={s.num} color={STAT_COLORS[i]} />
                  <p className="mt-3 text-[11px] font-medium text-ink-muted leading-snug">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission (GSAP pinned scroll) ──────────────────── */}
      <MissionSection />

      {/* ── Vision (word-reveal scroll) ───────────────────── */}
      <VisionSection />

      {/* ── Brand Identity ────────────────────────────────── */}
      <section className="relative bg-orange-light overflow-hidden">
        <ContourRings tint="magenta" tintAlt="orange" />
        <div className="wrap relative z-10 py-16 lg:py-20">
          <Reveal>
            <div className="text-center mb-10 lg:mb-12">
              <span className="section-label text-orange">Brand Identity</span>
            </div>
          </Reveal>
          <div className="max-w-[1080px] mx-auto">
            <Reveal>
              <motion.div
                whileHover={{ scale: 1.003 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                onClick={() => setZoom(true)}
                className="rounded-[20px] overflow-hidden bg-white shadow-[0_24px_60px_rgba(0,0,0,0.04)] cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/poster.jpg" alt="Brand Story" loading="lazy" decoding="async"
                  className="w-full h-auto object-contain block" />
              </motion.div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 text-center font-display font-semibold text-[20px] sm:text-[26px] text-ink leading-[1.3] max-w-[600px] mx-auto">
              &ldquo;The Third Eye to Visualize, Innovate, and Solve.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      <Lightbox
        src={zoom ? "/images/poster.jpg" : null}
        alt="Brand Story"
        onClose={() => setZoom(false)}
      />
    </>
  );
}
