"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";
import { Reveal, SectionHead, fadeUp, stagger } from "./motion";

export default function About() {
  const { content } = useSiteContent();
  const { about } = content;

  return (
    <section className="relative py-24 overflow-hidden bg-white photo-bg" id="about">
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/bg-about.jpg)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 70% at 50% 45%, rgba(255,250,240,0.93) 0%, rgba(255,250,240,0.6) 100%)",
        }}
      />
      <div className="wrap relative z-10">
        <SectionHead
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        {/* stats — bento row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {about.stats.map((s) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-line p-6 text-center shadow-sm hover:shadow-[0_18px_40px_-20px_rgba(28,20,8,0.35)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="font-display text-[30px] text-magenta-deep font-bold">
                {s.num}
              </div>
              <div className="text-[12.5px] text-ink-dim mt-1.5 leading-snug">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* vision + mission — bento 7/5 */}
        <div className="grid lg:grid-cols-12 gap-5 mb-12">
          <Reveal className="lg:col-span-7">
            <motion.div
              whileHover={{ y: -4 }}
              className="h-full rounded-2xl bg-gradient-to-br from-green-deep to-green p-8 text-white shadow-[0_24px_50px_-24px_rgba(28,20,8,0.5)]"
            >
              <h3 className="font-display text-[20px] mb-3.5 text-white">{about.visionTitle}</h3>
              <p className="text-[14.5px] text-white/90 leading-relaxed max-w-[46ch]">
                {about.vision}
              </p>
            </motion.div>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-5">
            <motion.div
              whileHover={{ y: -4 }}
              className="h-full rounded-2xl bg-cream-2 p-8 border border-line"
            >
              <h3 className="font-display text-[19px] text-green-deep mb-4">
                {about.missionTitle}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {about.missionItems.map((item, i) => (
                  <li key={i} className="text-[13.5px] text-ink-dim pl-[18px] relative">
                    <span className="absolute left-0 text-gold">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </Reveal>
        </div>

        {/* core areas — bento 6-col: 3+3 / 2+2+2 */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-4"
        >
          {about.coreAreas.map((c, i) => (
            <motion.div
              key={c.text}
              variants={fadeUp}
              className={`rounded-xl bg-cream-2 p-5 text-center hover:bg-cream-2/70 hover:-translate-y-1 transition-all duration-300 ${
                i < 2 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <div className="text-[26px] mb-2.5">{c.icon}</div>
              <div className="text-[12.5px] font-bold text-ink leading-snug">{c.text}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
