"use client";
import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";
import { Reveal } from "./motion";
import { DotField } from "./backdrops";

const STEP_COLORS = ["#2f8f4e", "#d6236b", "#e8720c"];
const STEP_LIGHT = ["#7fd39b", "#ff7ab0", "#ffa45c"];

const METRICS: { m: string; t: string; n: string }[] = [
  { m: "Particle Size", t: "1,000 – 10,000 nm", n: "< 100 nm" },
  { m: "Absorption", t: "Low", n: "10× higher" },
  { m: "Delivery", t: "Wastage · inconsistent", n: "Uniform · targeted" },
];

export default function Technology() {
  const { content } = useSiteContent();
  const { technology } = content;

  return (
    <section id="technology" className="relative bg-ink overflow-hidden">
      <DotField />

      <div className="wrap relative z-10 py-16 lg:py-20">
        <Reveal>
          <div className="text-center max-w-[800px] mx-auto mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-green-light rounded-full" />
              <span className="text-[11px] font-semibold tracking-[0.15em] text-green-light uppercase">The Science</span>
              <span className="w-8 h-[2px] bg-green-light rounded-full" />
            </div>
            <h2 className="font-display font-bold text-cream leading-[0.98] tracking-[-0.03em]"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}>
              What <span className="text-magenta">nano-delivery</span>
              <br />
              actually means
            </h2>
            <p className="mt-8 mx-auto max-w-[520px] text-[15px] text-cream/60 leading-[1.8]">
              {technology.description}
            </p>
          </div>
        </Reveal>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-5 mb-10 lg:mb-14 max-w-[1000px] mx-auto">
          {technology.steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.05] rounded-[20px] p-8 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{ background: STEP_COLORS[i] + "30" }}>
                    <span className="text-[15px] font-bold" style={{ color: STEP_LIGHT[i] }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-display font-semibold text-[18px] text-cream leading-tight">{s.title}</h3>
                  </div>
                </div>
                <p className="text-[14px] text-cream/55 leading-[1.8]">{s.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Comparison table */}
        <Reveal>
          <div className="max-w-[800px] mx-auto">
            <div className="rounded-[20px] overflow-hidden bg-white/[0.04] border border-white/10">
              <div className="grid grid-cols-[1fr_1fr_1.1fr]">
                <div className="px-6 py-4 border-b border-white/10">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-cream/40">Metric</span>
                </div>
                <div className="px-6 py-4 border-b border-l border-white/10 text-center">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-cream/40">Traditional</span>
                </div>
                <div className="px-6 py-4 border-b border-l border-green/25 bg-green/15 text-center">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{ color: STEP_LIGHT[0] }}>Nano I</span>
                </div>
              </div>
              {METRICS.map((row, i) => (
                <motion.div
                  key={row.m}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="grid grid-cols-[1fr_1fr_1.1fr]"
                >
                  <div className="px-6 py-5 border-b border-white/10 last:border-b-0 flex items-center">
                    <span className="font-semibold text-[13px] text-cream">{row.m}</span>
                  </div>
                  <div className="px-6 py-5 border-b border-l border-white/10 last:border-b-0 flex items-center justify-center">
                    <span className="text-[13px] text-cream/45">{row.t}</span>
                  </div>
                  <div className="px-6 py-5 border-b border-l border-green/20 last:border-b-0 flex items-center justify-center bg-green/10">
                    <span className="font-semibold text-[13px]" style={{ color: STEP_LIGHT[0] }}>{row.n}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
