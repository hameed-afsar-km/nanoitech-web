"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";
import { Reveal } from "./motion";

export default function Story() {
  const { content } = useSiteContent();
  const images = ["/images/story-wisdom.jpg", "/images/story-tradition.jpg"];
  const bgs = ["url(/images/bg-wisdom.jpg)", "url(/images/bg-tradition.jpg)"];

  return (
    <>
      {images.map((img, i) => (
        <section key={img} className="relative overflow-hidden bg-white">
          <div
            aria-hidden
            className="absolute -inset-[5%] z-0 bg-cover bg-center opacity-55"
            style={{
              backgroundImage: bgs[i],
              maskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, transparent 30%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 65% 65% at 50% 50%, transparent 30%, black 100%)",
            }}
          />
          <div className="wrap relative z-[1] max-w-[1100px] py-16">
            <Reveal className="max-w-[720px] mx-auto">
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-xl overflow-hidden shadow-[0_26px_54px_-18px_rgba(28,20,8,0.3)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Nano I Technology heritage" className="w-full block" />
              </motion.div>
              <p className="mt-3 text-center text-ink-dim font-display italic text-[14px]">
                {content.storyCredits[i] ?? ""}
              </p>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}
