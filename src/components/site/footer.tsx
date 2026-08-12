"use client";

import { useSiteContent } from "@/lib/site-content-context";

export default function Footer() {
  const { content } = useSiteContent();
  const { footer, products } = content;
  const productNames = products.map((p) => p.name);

  return (
    <footer className="bg-ink text-white/80 pt-16 pb-6">
      <div className="wrap">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)] gap-9 mb-12">
          <div className="foot-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/footer-logo.png" alt="Nano I Technology" className="h-[52px] mb-4" />
            <p className="text-[13px] max-w-[280px] opacity-75">{footer.tagline}</p>
          </div>
          <div>
            <h4 className="text-[11.5px] tracking-[0.1em] uppercase text-gold-light mb-4 font-mono">
              Products
            </h4>
            {productNames.map((name) => (
              <a key={name} href="#products" className="block text-[13.5px] mb-2.5 opacity-75 hover:opacity-100 transition-opacity">
                {name}
              </a>
            ))}
          </div>
          <div>
            <h4 className="text-[11.5px] tracking-[0.1em] uppercase text-gold-light mb-4 font-mono">
              Company
            </h4>
            {[
              { label: "Why Nano I", href: "#about" },
              { label: "Technology", href: "#technology" },
              { label: "Pricing", href: "#pricing" },
            ].map((l) => (
              <a key={l.href + l.label} href={l.href} className="block text-[13.5px] mb-2.5 opacity-75 hover:opacity-100 transition-opacity">
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <h4 className="text-[11.5px] tracking-[0.1em] uppercase text-gold-light mb-4 font-mono">
              Contact
            </h4>
            <a href={`mailto:${footer.email}`} className="block text-[13.5px] mb-2.5 opacity-75 hover:opacity-100 transition-opacity">
              {footer.email}
            </a>
            <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="block text-[13.5px] mb-2.5 opacity-75 hover:opacity-100 transition-opacity">
              {footer.phone}
            </a>
            <a href="#contact" className="block text-[13.5px] mb-2.5 opacity-75 hover:opacity-100 transition-opacity">
              Partner With Us
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2.5 pt-6 border-t border-white/10 text-[12px] opacity-60">
          <span>{footer.copyright}</span>
          <span>{footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
