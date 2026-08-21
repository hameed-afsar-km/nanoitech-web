"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, MoveRight } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import { ContourRings } from "./backdrops";
import { Lightbox } from "./lightbox";

const PLATES: { src: string; plate: string; label: string }[] = [
  { src: "/images/story-wisdom.jpg", plate: "Plate 01", label: "Ancient Botanical Wisdom" },
  { src: "/images/story-tradition.jpg", plate: "Plate 02", label: "Siddha Healing Lineage" },
];

export default function Story() {
  const { content } = useSiteContent();
  const targetRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setOverflow(Math.max(0, t.scrollWidth - t.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="story" ref={targetRef} className="relative bg-cream" style={{ height: `calc(100svh + ${overflow}px)` }}>
      <ContourRings tint="orange" />
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {/* Heritage backdrop */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/bg-about.jpg" alt="" aria-hidden="true" decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none select-none" />
        <motion.div ref={trackRef} style={{ x }} className="relative z-10 flex items-stretch gap-0 pl-[6vw] pr-[14vw] will-change-transform">
          {/* Intro panel */}
          <div className="w-[85vw] md:w-[46vw] flex-shrink-0 flex flex-col justify-center pr-6 md:pr-12">
            <div className="inline-flex items-center gap-3 mb-6 w-max">
              <span className="w-2 h-2 rounded-full bg-orange" />
              <span className="text-[11px] font-semibold tracking-[0.15em] text-orange uppercase">Heritage</span>
            </div>
            <h2 className="font-display font-bold text-ink leading-[0.98] tracking-[-0.03em]"
              style={{ fontSize: "clamp(34px, 4.4vw, 66px)" }}>
              Rooted in tradition.
              <br />
              <span className="grad-text-loop">Proof in science.</span>
            </h2>
            <p className="mt-7 text-ink-dim text-[16px] md:text-[17px] leading-[1.8] max-w-[460px]">
              Every Nano I formulation begins where Siddha medicine began — botanicals, oils and minerals,
              refined across generations of practice and validated at the nanoscale.
            </p>
            <div className="mt-9 flex items-center gap-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
                Scroll to explore
              </span>
              <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
                <MoveRight size={15} className="text-ink-muted" />
              </motion.span>
            </div>
          </div>

          {/* Image plates */}
          {PLATES.map((p, i) => (
            <figure key={p.src} className="w-[82vw] md:w-[54vw] flex-shrink-0 flex flex-col justify-center md:px-5">
              <motion.div
                whileHover={{ scale: 1.008 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setZoom(i)}
                className="rounded-[22px] overflow-hidden bg-cream-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.label} loading="lazy" decoding="async"
                  className="w-full h-[42vh] md:h-[58vh] object-cover" />
              </motion.div>
              <figcaption className="flex items-start justify-between gap-4 pt-5 px-2">
                <div>
                  <p className="font-display font-semibold text-[17px] text-ink leading-tight">{p.label}</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-muted mt-2">
                    {content.storyCredits[i] ?? "Siddha tradition, preserved across generations"}
                  </p>
                </div>
                <span className="text-[10px] font-medium text-ink-muted">{p.plate}</span>
              </figcaption>
            </figure>
          ))}

          {/* Outro panel */}
          <div className="w-[82vw] md:w-[40vw] flex-shrink-0 flex flex-col justify-center md:pl-8">
            <div className="py-10 border-t-[2px] border-orange/30">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-orange" />
                <span className="section-label text-ink-muted">Epilogue</span>
              </div>
              <p className="font-display font-semibold text-[26px] sm:text-[28px] leading-[1.25] tracking-tight text-ink">
                From the family kitchen to the laboratory — the lineage continues.
              </p>
              <p className="mt-5 text-[16px] text-ink-dim leading-[1.8]">
                Discover how five generations of botanical knowledge became a nanoemulsion product line.
              </p>
              <motion.a
                href="#about"
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 mt-8 text-[14px] font-semibold text-magenta"
              >
                Meet the science <ArrowRight size={14} />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Progress rail */}
        <div className="absolute bottom-12 inset-x-0 z-20">
          <div className="mx-[6vw] h-[2px] bg-ink/5 rounded-full overflow-hidden">
            <motion.div style={{ scaleX: progress, transformOrigin: "0%" }}
              className="h-full w-full origin-left rounded-full"
            >
              <div className="h-full bg-gradient-to-r from-orange via-magenta to-green" />
            </motion.div>
          </div>
        </div>

        <Lightbox
          src={zoom !== null ? PLATES[zoom].src : null}
          alt={zoom !== null ? PLATES[zoom].label : ""}
          onClose={() => setZoom(null)}
        />
      </div>
    </section>
  );
}
