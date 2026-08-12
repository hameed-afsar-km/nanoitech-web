"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";
import { Reveal } from "./motion";

export default function Pricing() {
  const { content } = useSiteContent();
  const products = content.products.filter((p) => p.price50 || p.price100 || p.price200);

  return (
    <section className="py-24 relative overflow-hidden bg-cream-2 photo-bg" id="pricing">
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/bg-pricing.jpg)" }}
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
        <Reveal>
          <div className="max-w-[640px] mx-auto text-center mb-4">
            <div className="eyebrow justify-center">Retail Pricing</div>
            <h2 className="text-[clamp(26px,3.2vw,40px)] text-ink mt-4">Consumer pricing by pack size</h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-x-auto rounded-xl shadow-[0_20px_40px_-20px_rgba(28,20,8,0.2)]">
            <table className="w-full border-collapse bg-white min-w-[640px]">
              <thead>
                <tr
                  className="text-left font-mono text-[11px] tracking-[0.08em] uppercase text-white"
                  style={{ background: "linear-gradient(90deg, var(--color-magenta), var(--color-orange))" }}
                >
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">50ml</th>
                  <th className="px-5 py-4">100ml</th>
                  <th className="px-5 py-4">200ml</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <motion.tr
                    key={p.id}
                    whileHover={{ backgroundColor: "rgba(214,35,107,0.04)" }}
                    className="border-b border-line"
                  >
                    <td className="px-5 py-[18px] font-display text-[16.5px] text-ink font-semibold">
                      {p.name}
                      <span className="block font-sans text-[12px] text-ink-dim font-normal mt-1">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-[18px] font-mono text-magenta-deep font-bold">{p.price50 ?? "—"}</td>
                    <td className="px-5 py-[18px] font-mono text-magenta-deep font-bold">{p.price100 ?? "—"}</td>
                    <td className="px-5 py-[18px] font-mono text-magenta-deep font-bold">{p.price200 ?? "—"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mt-[22px] text-[13px] text-ink-dim flex gap-2.5">
          <span className="text-magenta flex-shrink-0">—</span>
          {content.pricingNote}
        </p>
      </div>
    </section>
  );
}
