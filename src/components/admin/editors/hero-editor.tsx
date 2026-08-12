"use client";

import { useSiteContent } from "@/lib/site-content-context";
import { AddButton, Card, Field } from "../ui";

export default function HeroEditor() {
  const { content, setContent } = useSiteContent();
  const h = content.hero;

  const patch = (p: Partial<typeof h>) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, ...p } }));

  return (
    <div className="grid gap-5">
      <Card title="Hero Section" subtitle="Headline, intro, feature pills and calls to action">
        <Field label="Eyebrow" mono value={h.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <div className="grid sm:grid-cols-3 gap-3.5">
          <Field label="Title (part 1)" value={h.title1} onChange={(v) => patch({ title1: v })} />
          <Field label="Accent 1 (orange)" value={h.accent1} onChange={(v) => patch({ accent1: v })} />
          <Field label="Accent 2 (magenta)" value={h.accent2} onChange={(v) => patch({ accent2: v })} />
        </div>
        <Field label="Intro / lede" textarea rows={3} value={h.lede} onChange={(v) => patch({ lede: v })} />

        <div className="grid sm:grid-cols-2 gap-3.5">
          <Field label="Primary CTA label" value={h.primaryCta.label} onChange={(v) => patch({ primaryCta: { ...h.primaryCta, label: v } })} />
          <Field label="Primary CTA link" mono value={h.primaryCta.href} onChange={(v) => patch({ primaryCta: { ...h.primaryCta, href: v } })} />
          <Field label="Secondary CTA label" value={h.secondaryCta.label} onChange={(v) => patch({ secondaryCta: { ...h.secondaryCta, label: v } })} />
          <Field label="Secondary CTA link" mono value={h.secondaryCta.href} onChange={(v) => patch({ secondaryCta: { ...h.secondaryCta, href: v } })} />
        </div>

        <Field
          label="Featured product (hero image & label)"
          value={h.featuredProductId ?? ""}
          onChange={(v) => patch({ featuredProductId: v })}
          placeholder="product id, e.g. nanoshield"
        />
      </Card>

      <Card title="Feature Pills" subtitle="The four small highlight cards under the headline">
        <div className="grid gap-3.5">
          {h.features.map((f, i) => (
            <div key={i} className="grid sm:grid-cols-[80px_1fr] gap-3.5">
              <Field label="Icon" value={f.icon} onChange={(v) => patch({ features: h.features.map((x, j) => (j === i ? { ...x, icon: v } : x)) })} />
              <Field label="Label" value={f.label} onChange={(v) => patch({ features: h.features.map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
            </div>
          ))}
        </div>
        <AddButton onClick={() => patch({ features: [...h.features, { icon: "✨", label: "New Feature" }] })}>
          Add pill
        </AddButton>
      </Card>

      <Card title="Trust Strip" subtitle="Colored bar under the hero">
        <div className="grid gap-3.5">
          {content.trustStrip.map((t, i) => (
            <div key={i} className="grid sm:grid-cols-[90px_1fr] gap-3.5">
              <Field label="Icon" value={t.icon} onChange={(v) => setContent((c) => ({ ...c, trustStrip: c.trustStrip.map((x, j) => (j === i ? { ...x, icon: v } : x)) }))} />
              <Field
                label="Text (\\n = line break)"
                textarea
                rows={1}
                value={t.text}
                onChange={(v) => setContent((c) => ({ ...c, trustStrip: c.trustStrip.map((x, j) => (j === i ? { ...x, text: v } : x)) }))}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
