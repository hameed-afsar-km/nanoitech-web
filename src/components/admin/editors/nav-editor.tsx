"use client";

import { useSiteContent } from "@/lib/site-content-context";
import { AddButton, Card, Field } from "../ui";

export default function NavEditor() {
  const { content, setContent } = useSiteContent();
  const nav = content.nav;

  return (
    <div className="grid gap-5">
      <Card title="Branding" subtitle="Logo-adjacent text shown in the navigation bar">
        <Field label="Brand name" value={nav.brandName} onChange={(v) => setContent((c) => ({ ...c, nav: { ...c.nav, brandName: v } }))} />
        <Field label="Brand tagline" value={nav.brandTag} onChange={(v) => setContent((c) => ({ ...c, nav: { ...c.nav, brandTag: v } }))} />
        <Field label="CTA button text" value={nav.cta} onChange={(v) => setContent((c) => ({ ...c, nav: { ...c.nav, cta: v } }))} />
      </Card>

      <Card title="Navigation links" subtitle="Menu items across the top bar">
        <div className="grid gap-3.5">
          {nav.links.map((l, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-3.5">
              <Field label="Label" value={l.label} onChange={(v) => setContent((c) => ({ ...c, nav: { ...c.nav, links: c.nav.links.map((x, j) => (j === i ? { ...x, label: v } : x)) } }))} />
              <Field label="Anchor (#id)" mono value={l.href} onChange={(v) => setContent((c) => ({ ...c, nav: { ...c.nav, links: c.nav.links.map((x, j) => (j === i ? { ...x, href: v } : x)) } }))} />
            </div>
          ))}
        </div>
        <AddButton onClick={() => setContent((c) => ({ ...c, nav: { ...c.nav, links: [...c.nav.links, { label: "New Link", href: "#top" }] } }))}>
          Add link
        </AddButton>
      </Card>

      <Card title="Utility bar" subtitle="Scrolling ticker at the very top">
        <div className="grid gap-3.5">
          {content.utilityBar.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Field value={item} onChange={(v) => setContent((c) => ({ ...c, utilityBar: { ...c.utilityBar, items: c.utilityBar.items.map((x, j) => (j === i ? v : x)) } }))} />
              <button onClick={() => setContent((c) => ({ ...c, utilityBar: { ...c.utilityBar, items: c.utilityBar.items.filter((_, j) => j !== i) } }))} className="shrink-0 rounded-lg p-2 text-[11px] font-bold text-crimson hover:bg-crimson/10">
                ✕
              </button>
            </div>
          ))}
        </div>
        <AddButton onClick={() => setContent((c) => ({ ...c, utilityBar: { ...c.utilityBar, items: [...c.utilityBar.items, "◈ New Item"] } }))}>
          Add item
        </AddButton>
        <Field label="Follow text" value={content.utilityBar.follow} onChange={(v) => setContent((c) => ({ ...c, utilityBar: { ...c.utilityBar, follow: v } }))} />
      </Card>
    </div>
  );
}
