"use client";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { Reveal } from "./motion";
import { OrbitingDots } from "./geo-svg";
import { ContourBands } from "./backdrops";

const FILTER_COLORS: Record<string, string> = {
  aqua: "#2f8f4e",
  health: "#d6236b",
  personal: "#e8720c",
};

export default function Pricing() {
  const { content } = useSiteContent();
  const items = content.products.filter((p) => p.price50 || p.price100 || p.price200);
  const waPhone = (content.contact.whatsapp || content.footer.phone || "").replace(/[^\d]/g, "");

  return (
    <section id="pricing" className="relative overflow-hidden bg-magenta-light">
      <ContourBands />
      <OrbitingDots size={160} className="top-16 right-[10%]" />

      <div className="wrap relative z-10 py-16 lg:py-20">
        <Reveal>
          <div className="text-center max-w-[800px] mx-auto mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange/40" />
              <span className="text-[11px] font-semibold tracking-[0.2em] text-orange uppercase">Pricing</span>
              <span className="w-2 h-2 rounded-full bg-orange/40" />
            </div>
            <h2 className="font-display font-bold text-ink leading-[0.96] tracking-[-0.03em] mb-8"
              style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}>
              Consumer pricing
              <br />
              <span className="bg-gradient-to-r from-orange via-magenta to-green bg-clip-text text-transparent">by pack size</span>
            </h2>
            <p className="text-[15px] text-ink-dim leading-[1.8] max-w-[540px] mx-auto">
              Available in 50ml, 100ml &amp; 200ml. Transparent retail prices — no hidden fees.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p, i) => {
            const color = FILTER_COLORS[p.filter ?? "health"] ?? "#d6236b";
            return (
              <Reveal key={p.id} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative bg-white rounded-[20px] overflow-hidden border border-line shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-shadow"
                >
                  <div className="p-8 text-center">
                    {p.image && (
                      <div className="relative w-20 h-20 mx-auto mb-5 overflow-hidden rounded-[14px] bg-cream-2 border border-line">
                        <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      <p className="text-[9px] font-medium uppercase tracking-[0.14em]" style={{ color }}>{p.category}</p>
                    </div>
                    <h3 className="font-display font-semibold text-[18px] text-ink mb-3">{p.name}</h3>
                    <div className="flex items-center justify-center gap-0.5 mb-6">
                      {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={11} className="text-orange fill-orange" />))}
                      <span className="text-[9px] text-ink-muted ml-1">4.8</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-8">
                      {(["50", "100", "200"] as const).map((s) => {
                        const pr = p[`price${s}` as keyof typeof p] as string | undefined;
                        const isBest = s === "100";
                        return (
                          <motion.div key={s} whileHover={{ scale: 1.04 }}
                            className="rounded-[12px] p-3 transition-all duration-200"
                            style={isBest
                              ? { background: `${color}0A`, border: `1.5px solid ${color}25` }
                              : { background: "#fafafa", border: "1px solid rgba(0,0,0,0.04)" }}>
                            <p className="text-[8px] uppercase font-semibold mb-1 tracking-wider"
                              style={isBest ? { color } : { color: "#bbb" }}>
                              {s}ml{isBest && " ★"}
                            </p>
                            <p className="font-display font-bold text-[16px] text-ink">{pr && pr !== "—" ? pr : "—"}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                    <motion.a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hi, I want to order ${p.name} from Nano I Technology.`)}`}
                      target="_blank" rel="noopener"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-[12px] font-semibold uppercase tracking-wide transition-all duration-200"
                      style={{ background: color, color: "#fff" }}>
                      Order Now <ArrowRight size={12} />
                    </motion.a>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 text-center">
            <p className="text-[13px] text-ink-dim max-w-[520px] mx-auto leading-relaxed">{content.pricingNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
