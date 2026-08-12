"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSiteContent } from "@/lib/site-content-context";
import type { ProductFilter } from "@/lib/types";
import { Reveal } from "./motion";

const GRADIENTS: Record<string, string> = {
  nanoshield: "linear-gradient(160deg, var(--color-crimson), var(--color-crimson-deep))",
  rootique: "linear-gradient(160deg, var(--color-green), var(--color-green-deep))",
  herborelief: "linear-gradient(160deg, var(--color-purple), var(--color-purple-deep))",
  cocorose: "linear-gradient(160deg, var(--color-blue), var(--color-blue-deep))",
  venorestore: "linear-gradient(160deg, var(--color-orange), var(--color-orange-deep))",
};

const FILTER_GRADIENTS: Record<string, string> = {
  aqua: "linear-gradient(160deg, var(--color-crimson), var(--color-crimson-deep))",
  health: "linear-gradient(160deg, var(--color-orange), var(--color-orange-deep))",
  personal: "linear-gradient(160deg, var(--color-green), var(--color-green-deep))",
};

const BUTTON_COLORS: Record<string, string> = {
  nanoshield: "var(--color-crimson-deep)",
  rootique: "var(--color-green-deep)",
  herborelief: "var(--color-purple-deep)",
  cocorose: "var(--color-blue-deep)",
  venorestore: "var(--color-orange-deep)",
};

const cardEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Products() {
  const { content } = useSiteContent();
  const [filter, setFilter] = useState<"all" | ProductFilter>("all");

  const featuredId = content.hero.featuredProductId ?? content.products[0]?.id ?? "";
  const ordered = [
    ...content.products.filter((p) => p.id === featuredId),
    ...content.products.filter((p) => p.id !== featuredId),
  ];

  const filtered =
    filter === "all" ? ordered : ordered.filter((p) => p.filter === filter);

  /* The hero-featured product becomes the large 2×2 bento tile (only on "All"). */
  const bigId = filter === "all" ? filtered[0]?.id : undefined;

  const filters: { key: "all" | ProductFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "aqua", label: "Aquaculture" },
    { key: "health", label: "Healthcare" },
    { key: "personal", label: "Personal Care" },
  ];

  return (
    <section className="py-24 bg-white" id="products">
      <div className="wrap">
        <Reveal>
          <div
            className="relative rounded-2xl overflow-hidden p-8 lg:p-9 mb-9"
            style={{
              backgroundImage: "url(/images/bg-products.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
            }}
          >
            <div className="absolute inset-0 bg-white/85" />
            <div className="relative z-[1] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="eyebrow">Our Premium Range</div>
                <h2 className="text-[clamp(26px,3.2vw,38px)]">
                  <span className="text-green-deep">Nature. Nano.</span>{" "}
                  <span className="text-orange italic">Nurture.</span>
                </h2>
              </div>
              <p className="text-ink-dim max-w-[380px] text-[14.5px]">
                Discover our range of nanoemulsion-based herbal products, crafted with care and
                backed by science.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-wrap gap-2.5 justify-center mb-11">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-[18px] py-2.5 text-[13px] font-bold rounded-[20px] border transition-all duration-300 cursor-pointer ${
                filter === f.key
                  ? "border-magenta text-magenta-deep bg-magenta/10"
                  : "border-line text-ink-dim bg-cream hover:border-magenta hover:text-magenta-deep hover:bg-magenta/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* bento grid — featured tile spans 2×2 on large screens */}
        <motion.div
          layout
          className="grid lg:grid-cols-3 lg:grid-flow-dense gap-6 auto-rows-fr"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => {
              const big = p.id === bigId;
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -12 }}
                  transition={{ duration: 0.4, ease: cardEase }}
                  className={`relative rounded-[16px] p-6 text-white flex flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_26px_46px_-16px_rgba(28,20,8,0.4)] transition-all duration-300 ${
                    big
                      ? "lg:col-span-2 lg:row-span-2 min-h-[420px] lg:min-h-[540px]"
                      : "min-h-[420px] lg:min-h-[260px]"
                  }`}
                  style={{
                    background: GRADIENTS[p.id] ?? FILTER_GRADIENTS[p.filter],
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-30 blur-2xl"
                    style={{ background: "radial-gradient(circle, #fff, transparent 70%)" }}
                  />

                  {p.badge && (
                    <div className="absolute top-4 right-4 bg-white/95 text-crimson-deep font-mono text-[10px] tracking-[0.06em] uppercase px-2.5 py-1.5 rounded-[20px] font-bold flex items-center gap-1 z-[2]">
                      {p.badge}
                    </div>
                  )}

                  <div className="bg-white rounded-[10px] p-2.5 mb-4 shadow-[0_12px_24px_rgba(0,0,0,0.15)] group overflow-hidden">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        className={`rounded-md w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                          big ? "aspect-[16/9]" : "aspect-[4/3]"
                        }`}
                      />
                    ) : (
                      <div
                        className={`rounded-md w-full flex items-center justify-center font-display text-[64px] text-ink bg-cream-2 ${
                          big ? "aspect-[16/9]" : "aspect-[4/3]"
                        }`}
                      >
                        {(p.name.charAt(0) || "N").toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h3 className={`text-white font-display font-semibold ${big ? "text-[28px]" : "text-[22px]"}`}>
                    {p.name}
                  </h3>
                  <div className="text-[11px] uppercase tracking-[0.08em] opacity-85 font-bold mb-3.5">
                    {p.category}
                  </div>
                  <ul className="flex flex-col gap-[7px] mb-5 flex-1">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="text-[13px] opacity-95 flex gap-2 items-start">
                        <span className="font-extrabold flex-shrink-0">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <a
                      href={p.cta?.href ?? "#contact"}
                      className="bg-white rounded-[24px] px-5 py-2.5 text-[12.5px] font-extrabold inline-flex items-center gap-2 self-start hover:translate-x-1 transition-transform duration-300"
                      style={{ color: BUTTON_COLORS[p.id] ?? "var(--color-magenta-deep)" }}
                    >
                      {p.cta?.label ?? "Enquire →"}
                    </a>
                    {big && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src="/images/laurel.jpg"
                        alt=""
                        className="w-14 opacity-95"
                        aria-hidden
                      />
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
