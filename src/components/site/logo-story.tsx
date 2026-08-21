"use client";
import { motion } from "framer-motion";
import { Reveal } from "./motion";

export default function LogoStory() {
  return (
    <section id="logo-story" className="relative bg-cream">
      <div className="wrap-narrow relative z-10 pt-16 lg:pt-24 pb-24 lg:pb-32">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="gradient-bar w-8" />
            <span className="section-label text-orange">Brand Identity</span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="relative mx-auto max-w-[820px]">
            <motion.div
              whileHover={{ scale: 1.002 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-cream-2 shadow-[0_24px_64px_rgba(0,0,0,0.06)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/poster.jpg" alt="Brand Story"
                  className="w-full h-[48vh] sm:h-[52vh] lg:h-[58vh] object-cover object-top block" />
              </div>
              <div className="flex items-center justify-between mt-6 px-2">
                <p className="font-display font-semibold text-[18px] sm:text-[22px] text-ink leading-[1.3] max-w-[540px]">
                  &ldquo;The Third Eye to Visualize, Innovate, and Solve.&rdquo;
                </p>
                <span className="font-mono text-[9px] font-medium uppercase tracking-widest text-ink-muted hidden sm:block">
                  Fig. 02
                </span>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
