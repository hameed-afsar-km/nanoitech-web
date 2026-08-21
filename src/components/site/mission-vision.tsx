"use client";

/* ═══════════════════════════════════════════════════════════════
   PURPOSE — two-part scrollytelling
   MissionSection: pinned viewport where the four commitments
   activate one-by-one against a filling progress rail.
   VisionSection: flowing section whose statement reveals
   word-by-word with scroll, followed by focus-area chips.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteContent } from "@/lib/site-content-context";

gsap.registerPlugin(ScrollTrigger);

const MAGENTA = "#d6236b";

export function MissionSection() {
  const { content } = useSiteContent();
  const { about } = content;
  const root = useRef<HTMLElement>(null);
  const railFill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("lite")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    /* Desktop: pin and step through commitments cumulatively */
    mm.add("(min-width: 1024px)", () => {
      const rows = gsap.utils.toArray<HTMLElement>(".mv-row");
      const nums = gsap.utils.toArray<HTMLElement>(".mv-num");

      gsap.set(rows, { opacity: 0.16, x: -14 });
      gsap.set(nums, {
        backgroundColor: "rgba(255,255,255,0)",
        color: "rgba(214,35,107,0.35)",
        scale: 0.88,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=230%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      tl.from(".mv-head", { y: 40, opacity: 0, duration: 0.9 });

      rows.forEach((_, i) => {
        tl.to(rows[i], { opacity: 1, x: 0, duration: 0.55 }, ">-0.05").to(
          nums[i],
          {
            backgroundColor: "#ffffff",
            color: MAGENTA,
            scale: 1,
            duration: 0.4,
          },
          "<"
        );
      });

      tl.to({}, { duration: 0.6 });
      tl.to(
        railFill.current,
        { scaleY: 1, duration: tl.duration(), ease: "none" },
        0
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative bg-magenta-light overflow-hidden lg:min-h-[100svh] flex items-center"
    >
      <div className="wrap relative z-10 w-full py-16 lg:py-20">
        <div className="relative max-w-[860px] mx-auto lg:pl-10">
          {/* Progress rail */}
          <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-magenta/10 overflow-hidden hidden lg:block">
            <span
              ref={railFill}
              className="block w-full h-full bg-magenta origin-top"
              style={{ transform: "scaleY(0)" }}
            />
          </span>

          {/* Heading */}
          <div className="mv-head mb-9 lg:mb-12">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-magenta" />
              <span className="section-label text-magenta">{about.missionTitle}</span>
            </div>
            <h2
              className="font-display font-bold text-ink leading-[1.02] tracking-[-0.03em]"
              style={{ fontSize: "clamp(32px, 4.2vw, 58px)" }}
            >
              Four commitments,
              <br />
              <span className="grad-text-loop">one purpose.</span>
            </h2>
          </div>

          {/* Commitments */}
          <ul>
            {about.missionItems.map((m, i) => (
              <li
                key={i}
                className="mv-row flex items-start gap-5 lg:gap-7 py-5 lg:py-7 border-b border-magenta/10 last:border-b-0"
              >
                <span className="mv-num shrink-0 w-11 h-11 lg:w-14 lg:h-14 rounded-full border border-magenta/30 bg-white font-mono font-semibold text-[13px] lg:text-[15px] text-magenta flex items-center justify-center">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] lg:text-[17px] text-ink/70 leading-[1.7] pt-1.5 lg:pt-2.5">
                  {m}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function VisionSection() {
  const { content } = useSiteContent();
  const { about } = content;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("lite")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    /* Desktop: scrubbed word-by-word reveal, then chips */
    mm.add("(min-width: 1024px)", () => {
      const words = root.current?.querySelectorAll(".v-word");
      if (!words || !words.length) return;

      gsap.set(words, { opacity: 0.1 });

      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".v-statement",
          start: "top 66%",
          end: "top 22%",
          scrub: true,
        },
      });

      gsap.from(".v-chip", {
        y: 16,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".v-chips",
          start: "top 90%",
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-cream overflow-hidden">
      <div className="wrap relative z-10 py-16 lg:py-24">
        <div className="max-w-[920px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-7">
            <span className="w-8 h-[2px] bg-orange rounded-full" />
            <span className="section-label text-orange">{about.visionTitle}</span>
            <span className="w-8 h-[2px] bg-orange rounded-full" />
          </div>

          <p
            className="v-statement font-display font-semibold text-ink leading-[1.3] tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px, 3.4vw, 46px)" }}
          >
            {about.vision.split(" ").map((w, i) => (
              <span key={i} className="v-word inline-block mr-[0.26em] last:mr-0">
                {w}
              </span>
            ))}
          </p>

          <div className="v-chips flex flex-wrap justify-center gap-2 mt-9">
            {about.coreAreas.map((a) => (
              <span
                key={a.text}
                className="v-chip inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-full border border-orange/25 bg-orange-light/60 text-ink/70"
              >
                {a.icon} {a.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
