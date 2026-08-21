"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MessageSquare, X, Star, ArrowRight, Sparkles } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import type { Product, ProductFilter } from "@/lib/types";
import { TriDots } from "./geo-svg";
import { ContourRings, GrainVeil } from "./backdrops";

const SIZES = ["50", "100", "200"] as const;

const FILTERS: { key: "all" | ProductFilter; label: string; color: string }[] = [
  { key: "all", label: "All Products", color: "#111111" },
  { key: "aqua", label: "Aquaculture", color: "#2f8f4e" },
  { key: "health", label: "Healthcare", color: "#d6236b" },
  { key: "personal", label: "Personal Care", color: "#e8720c" },
];

const FILTER_COLORS: Record<string, string> = { all: "#111111", aqua: "#2f8f4e", health: "#d6236b", personal: "#e8720c" };

const FILTER_BG: Record<string, string> = {
  all: "linear-gradient(135deg, rgba(214,35,107,0.02), rgba(47,143,78,0.02))",
  aqua: "linear-gradient(135deg, rgba(47,143,78,0.04), rgba(47,143,78,0.01))",
  health: "linear-gradient(135deg, rgba(214,35,107,0.04), rgba(214,35,107,0.01))",
  personal: "linear-gradient(135deg, rgba(232,114,12,0.04), rgba(232,114,12,0.01))",
};

export default function Products() {
  const { content } = useSiteContent();
  const [filter, setFilter] = useState<"all" | ProductFilter>("all");
  const [modal, setModal] = useState<Product | null>(null);
  const [sz, setSz] = useState<Record<string, (typeof SIZES)[number]>>({});

  const featuredId = content.hero.featuredProductId ?? content.products[0]?.id;
  const all = [
    ...content.products.filter((p) => p.id === featuredId),
    ...content.products.filter((p) => p.id !== featuredId),
  ];
  const filtered = filter === "all" ? all : all.filter((p) => p.filter === filter);

  const getPrice = (p: Product, s: (typeof SIZES)[number]) => s === "50" ? p.price50 : s === "100" ? p.price100 : p.price200;
  const waPhone = (content.contact.whatsapp || content.footer.phone || "").replace(/[^\d]/g, "");

  return (
    <section id="products" className="relative overflow-hidden bg-cream">
      <ContourRings tint="green" />
      <GrainVeil />

      <div className="relative z-10 wrap py-16 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-[800px] mx-auto mb-8 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-green/40" />
              <span className="text-[11px] font-semibold tracking-[0.2em] text-green uppercase">Our Collection</span>
              <span className="w-2 h-2 rounded-full bg-green/40" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-ink leading-[0.96] tracking-[-0.03em] mb-8"
            style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
          >
            Nature.{" "}
            <span className="bg-gradient-to-r from-green via-orange to-magenta bg-clip-text text-transparent">Nano.</span>{" "}
            Nurture.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[15px] text-ink-dim leading-[1.8] max-w-[540px] mx-auto"
          >
            Blending ancient botanical wisdom with nanoemulsion science — every product harnesses the pure power of nature, enhanced for modern life.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8 lg:mb-10"
        >
          <div className="inline-flex gap-1 p-1 rounded-full bg-cream-2 border border-line">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <motion.button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  whileTap={{ scale: 0.97 }}
                  className="relative px-5 py-2.5 text-[11px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer rounded-full flex items-center gap-1.5"
                  style={{ color: active ? "#fff" : "#999" }}
                >
                  {active && (
                    <motion.div
                      layoutId="filterBg"
                      className="absolute inset-0 rounded-full"
                      style={{ background: f.color }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="relative rounded-[28px] p-6 sm:p-8 lg:p-10" style={{ background: FILTER_BG[filter] }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => {
                const curSz = sz[p.id] ?? "100";
                const curPr = getPrice(p, curSz);
                const hasPr = Boolean(p.price50 || p.price100 || p.price200);
                const filterColor = FILTER_COLORS[p.filter ?? "all"];

                return (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="cursor-pointer group"
                    onClick={() => setModal(p)}
                  >
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative bg-white rounded-[20px] overflow-hidden border border-line shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                    >
                      <div className="relative overflow-hidden aspect-square">
                        {p.badge && (
                          <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="absolute top-3 left-3 z-10 text-[8px] uppercase tracking-wider px-3 py-1.5 rounded-full font-semibold text-white flex items-center gap-1"
                            style={{ background: filterColor }}
                          >
                            <Sparkles size={9} />
                            {p.badge}
                          </motion.span>
                        )}
                        {p.image ? (
                          <img src={p.image} alt={p.name} loading="lazy" decoding="async"
                            className="w-full h-full object-contain bg-white transition-transform duration-700 group-hover:scale-[1.04]" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${filterColor}08, ${filterColor}15)` }}>
                            <TriDots />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow">
                            <ArrowRight size={14} className="text-ink" />
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: filterColor }} />
                          <p className="text-[8px] font-medium uppercase tracking-[0.14em]" style={{ color: filterColor }}>
                            {p.category}
                          </p>
                        </div>
                        <h3 className="font-display font-semibold text-[16px] text-ink leading-snug mb-2">{p.name}</h3>
                        <div className="flex items-center gap-0.5 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} className="text-orange fill-orange" />
                          ))}
                          <span className="text-[8px] text-ink-muted ml-1">4.8</span>
                        </div>
                        {hasPr ? (
                          <div className="flex items-center gap-2">
                            <div className="flex rounded-xl border border-line overflow-hidden bg-cream-2/50">
                              {SIZES.map((s) => {
                                const pk = `price${s}` as keyof Product;
                                if (!p[pk] || p[pk] === "—") return null;
                                return (
                                  <button key={s}
                                    onClick={(e) => { e.stopPropagation(); setSz((prev) => ({ ...prev, [p.id]: s })); }}
                                    className="px-2.5 py-1.5 text-[9px] font-medium cursor-pointer transition-all duration-200"
                                    style={curSz === s ? { background: filterColor, color: "#fff" } : { color: "#aaa" }}>
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                            {curPr && curPr !== "—" && (
                              <span className="font-display font-bold text-[17px] text-ink">{curPr}</span>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-ink-muted font-medium">B2B pricing</p>
                        )}
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/20 backdrop-blur-xl" onClick={() => setModal(null)} />
            <motion.div key="md" initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[700px] bg-cream rounded-[24px] overflow-hidden my-8 shadow-[0_32px_80px_rgba(0,0,0,0.12)]">
              <div className="h-[3px] bg-gradient-to-r from-magenta via-orange to-green" />
              <div className="flex items-center justify-between p-4 pb-0 sm:p-6 sm:pb-0">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green" /> Product Details
                </span>
                <button onClick={() => setModal(null)}
                  className="w-9 h-9 rounded-full bg-cream-2 hover:bg-cream-3 flex items-center justify-center text-ink/40 hover:text-ink transition-all cursor-pointer">
                  <X size={15} />
                </button>
              </div>
              <div className="grid sm:grid-cols-[280px_1fr] gap-5 sm:gap-8 p-4 sm:p-6">
                <div className="relative rounded-[16px] overflow-hidden bg-cream-2 aspect-square min-h-[250px]">
                  {modal.image ? (
                    <img src={modal.image} alt={modal.name} className="w-full aspect-square object-contain bg-white block" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><TriDots size="lg" /></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: FILTER_COLORS[modal.filter ?? "health"] }} />
                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-ink-muted">{modal.category}</span>
                  </div>
                  <h3 className="font-display font-semibold text-[22px] text-ink mb-3 leading-snug">{modal.name}</h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (<Star key={s} size={12} className="text-orange fill-orange" />))}
                    <span className="text-[10px] text-ink-muted ml-1">4.8 (120+)</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 mb-5 flex-1">
                    {modal.bullets.map((b, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex gap-3 text-[13px] text-ink-dim items-start">
                        <span className="mt-1 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: `${FILTER_COLORS[modal.filter ?? "health"]}12` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: FILTER_COLORS[modal.filter ?? "health"] }} />
                        </span>{b}
                      </motion.li>
                    ))}
                  </ul>
                  {(modal.price50 || modal.price100 || modal.price200) && (
                    <div className="grid grid-cols-3 gap-2 rounded-[14px] overflow-hidden border border-line mb-5 bg-white">
                      {modal.price50 && (
                        <div className="p-3 text-center border-r border-line">
                          <p className="text-[8px] uppercase text-ink-muted font-medium mb-0.5">50ml</p>
                          <p className="font-display font-bold text-[14px] text-ink">{modal.price50}</p>
                        </div>
                      )}
                      {modal.price100 && (
                        <div className="p-3 text-center border-r border-line" style={{ background: `${FILTER_COLORS[modal.filter ?? "health"]}08` }}>
                          <p className="text-[8px] uppercase font-medium mb-0.5" style={{ color: FILTER_COLORS[modal.filter ?? "health"] }}>100ml ★</p>
                          <p className="font-display font-bold text-[14px] text-ink">{modal.price100}</p>
                        </div>
                      )}
                      {modal.price200 && (
                        <div className="p-3 text-center">
                          <p className="text-[8px] uppercase text-ink-muted font-medium mb-0.5">200ml</p>
                          <p className="font-display font-bold text-[14px] text-ink">{modal.price200}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-3 flex-wrap">
                    <a href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hi, I'd like to order ${modal.name} from Nano I Technology.`)}`}
                      target="_blank" rel="noopener" className="btn btn-fire btn-sm flex-1 justify-center">
                      <MessageSquare size={13} /> WhatsApp
                    </a>
                    <a href={modal.cta?.href ?? "#contact"} className="btn btn-sm">Enquire</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
