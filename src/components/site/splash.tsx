"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Splash({ onDone }: { onDone: () => void }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), 1200);
    const t2 = setTimeout(onDone, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="fixed inset-0 z-[999] bg-white flex items-center justify-center"
        >
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease }}
              className="font-display font-bold uppercase text-ink leading-[0.85] tracking-[-0.06em]"
              style={{ fontSize: "clamp(40px, 10vw, 120px)" }}
            >
              NANO<span className="text-magenta">I</span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease }}
              className="mx-auto mt-3 max-w-[100px] h-[3px] bg-gradient-to-r from-magenta via-orange to-green origin-left rounded-full"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease }}
              className="mt-4 text-[11px] uppercase tracking-[0.25em] text-ink-muted font-medium"
            >
              Nanotechnology Redefined
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
