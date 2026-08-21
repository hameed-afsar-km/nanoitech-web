"use client";
import { motion, type Variants, useScroll, useSpring } from "framer-motion";
import React from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export const vUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
export const vLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};
export const vRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};
export const vScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
};
export const vStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

export function Reveal({
  children, className = "", delay = 0,
  dir = "up",
}: {
  children: React.ReactNode; className?: string; delay?: number;
  dir?: "up"|"left"|"right"|"scale"|"none";
}) {
  const map = { up: vUp, left: vLeft, right: vRight, scale: vScale, none: {} };
  return (
    <motion.div className={className} variants={map[dir]}
      initial="hidden" whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 z-[500] h-[3px]"
    >
      <div className="h-full bg-gradient-to-r from-magenta via-orange to-green" />
    </motion.div>
  );
}
