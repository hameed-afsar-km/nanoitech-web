"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";
import { Reveal, fadeUp, stagger } from "./motion";

const drops = [
  { className: "d1", color: "var(--color-green)" },
  { className: "d3", color: "var(--color-orange)" },
  { className: "d5", color: "var(--color-blue)" },
];

const dropsRev = [
  { className: "d2", color: "var(--color-magenta)" },
  { className: "d4", color: "var(--color-purple)" },
];

function Drop({ rotate, color }: { rotate: number; color: string }) {
  return (
    <span
      className="absolute w-4 h-4 rounded-full top-1/2 left-1/2"
      style={{
        color,
        background: color,
        boxShadow: `0 0 14px 3px ${color}`,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) translateX(38%)`,
      }}
    />
  );
}

export default function Technology() {
  const { content } = useSiteContent();
  const { technology } = content;

  return (
    <section className="py-24 relative overflow-hidden bg-cream-2 photo-bg" id="technology">
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/bg-tech.jpg)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 70% at 50% 45%, rgba(255,250,240,0.93) 0%, rgba(255,250,240,0.6) 100%)",
        }}
      />
      <div className="wrap relative z-10 grid lg:grid-cols-2 gap-[70px] items-center">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.div variants={fadeUp} className="eyebrow">
            {technology.eyebrow}
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-[clamp(26px,3vw,38px)] mb-4">
            {technology.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-dim mb-7 max-w-[480px]">
            {technology.description}
          </motion.p>
          <motion.ul variants={stagger} className="list-none">
            {technology.steps.map((s) => (
              <motion.li
                key={s.num}
                variants={fadeUp}
                className="flex gap-[18px] py-5 border-t border-line last:border-b"
              >
                <span className="font-mono text-magenta-deep text-[13px] pt-1 font-bold">
                  {s.num}
                </span>
                <div>
                  <div className="font-display text-[16.5px] text-ink mb-1 font-semibold">
                    {s.title}
                  </div>
                  <div className="text-[13.5px] text-ink-dim">{s.desc}</div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <Reveal>
          <motion.div
            className="relative aspect-square rounded-full p-2.5 flex items-center justify-center"
            style={{
              background:
                "conic-gradient(from 0deg, var(--color-green), var(--color-magenta), var(--color-orange), var(--color-purple), var(--color-green))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="w-full h-full rounded-full relative overflow-hidden flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 28% 24%, rgba(47,143,78,0.65), transparent 42%), radial-gradient(circle at 76% 28%, rgba(214,35,107,0.6), transparent 44%), radial-gradient(circle at 74% 76%, rgba(232,114,12,0.6), transparent 44%), radial-gradient(circle at 24% 76%, rgba(142,42,107,0.6), transparent 44%), radial-gradient(circle at 50% 50%, rgba(31,111,168,0.4), transparent 55%), var(--color-white)",
              }}
            >
              <div className="absolute inset-0 animate-spin-cw">
                {drops.map((d, i) => (
                  <Drop key={d.className} rotate={i * 144} color={d.color} />
                ))}
              </div>
              <div className="absolute inset-0 animate-spin-ccw">
                {dropsRev.map((d, i) => (
                  <Drop key={d.className} rotate={i * 216 + 36} color={d.color} />
                ))}
              </div>
              <div
                className="w-[26%] h-[26%] rounded-full relative z-[2]"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, var(--color-gold-light), var(--color-gold))",
                  boxShadow: "0 0 50px 14px rgba(201,151,31,0.5)",
                }}
              />
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
