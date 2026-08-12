"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";

export default function TrustStrip() {
  const { content } = useSiteContent();
  return (
    <div className="grad-green py-0">
      <div className="wrap grid grid-cols-2 lg:grid-cols-4">
        {content.trustStrip.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-3 px-5 py-[22px] text-white border-b lg:border-b-0 border-white/20 last:border-b-0 [&:not(:last-child)]:lg:border-r lg:border-white/20"
          >
            <span className="text-[20px] flex-shrink-0">{item.icon}</span>
            <span className="text-[13px] font-bold leading-tight whitespace-pre-line">
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
