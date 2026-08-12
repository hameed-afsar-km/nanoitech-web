"use client";

import { motion } from "framer-motion";
import { useSiteContent } from "@/lib/site-content-context";
import { fadeUp, stagger } from "./motion";

export default function CtaBand() {
  const { content } = useSiteContent();
  const { contact } = content;

  return (
    <div className="grad-cta py-[90px] text-center text-white" id="contact">
      <div className="wrap">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-[clamp(26px,3.4vw,40px)] max-w-[640px] mx-auto mb-4 text-white"
          >
            {contact.title}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/85 max-w-[500px] mx-auto mb-8">
            {contact.description}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5 justify-center">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-[13.5px] font-extrabold rounded-[28px] bg-white text-magenta-deep hover:-translate-y-0.5 transition-transform duration-300"
            >
              {contact.email}
            </a>
            <a href={contact.secondary.href} className="btn btn-ghost !text-white !border-white hover:!bg-white/10">
              {contact.secondary.label}
            </a>
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost !text-white !border-white hover:!bg-white/10"
              >
                Chat on WhatsApp
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
