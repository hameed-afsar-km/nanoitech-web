"use client";

import { useSiteContent } from "@/lib/site-content-context";
import { Card, Field } from "../ui";

export default function ContactEditor() {
  const { content, setContent } = useSiteContent();
  const ct = content.contact;
  const f = content.footer;

  return (
    <div className="grid gap-5">
      <Card title="Contact / CTA Band" subtitle="Gradient band above the footer">
        <Field label="Title" value={ct.title} onChange={(v) => setContent((c) => ({ ...c, contact: { ...c.contact, title: v } }))} />
        <Field label="Description" textarea rows={3} value={ct.description} onChange={(v) => setContent((c) => ({ ...c, contact: { ...c.contact, description: v } }))} />
        <Field label="Email" mono value={ct.email} onChange={(v) => setContent((c) => ({ ...c, contact: { ...c.contact, email: v } }))} />
        <div className="grid sm:grid-cols-2 gap-3.5">
          <Field label="Secondary CTA label" value={ct.secondary.label} onChange={(v) => setContent((c) => ({ ...c, contact: { ...c.contact, secondary: { ...c.contact.secondary, label: v } } }))} />
          <Field label="Secondary CTA link" mono value={ct.secondary.href} onChange={(v) => setContent((c) => ({ ...c, contact: { ...c.contact, secondary: { ...c.contact.secondary, href: v } } }))} />
        </div>
        <Field label="WhatsApp number (optional)" mono value={ct.whatsapp ?? ""} onChange={(v) => setContent((c) => ({ ...c, contact: { ...c.contact, whatsapp: v || undefined } }))} />
      </Card>

      <Card title="Footer" subtitle="Footer tagline, contact details and legal lines">
        <Field label="Tagline" textarea rows={3} value={f.tagline} onChange={(v) => setContent((c) => ({ ...c, footer: { ...c.footer, tagline: v } }))} />
        <div className="grid sm:grid-cols-2 gap-3.5">
          <Field label="Email" mono value={f.email} onChange={(v) => setContent((c) => ({ ...c, footer: { ...c.footer, email: v } }))} />
          <Field label="Phone" mono value={f.phone} onChange={(v) => setContent((c) => ({ ...c, footer: { ...c.footer, phone: v } }))} />
        </div>
        <Field label="Copyright line" mono value={f.copyright} onChange={(v) => setContent((c) => ({ ...c, footer: { ...c.footer, copyright: v } }))} />
        <Field label="Disclaimer" textarea rows={2} value={f.disclaimer} onChange={(v) => setContent((c) => ({ ...c, footer: { ...c.footer, disclaimer: v } }))} />
      </Card>

      <Card title="Pricing note" subtitle="Small note under the pricing table">
        <Field label="Note" textarea rows={3} value={content.pricingNote} onChange={(v) => setContent((c) => ({ ...c, pricingNote: v }))} />
      </Card>
    </div>
  );
}
