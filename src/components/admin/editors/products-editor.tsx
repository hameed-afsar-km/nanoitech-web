"use client";

import { useSiteContent } from "@/lib/site-content-context";
import type { Product } from "@/lib/types";
import { AddButton, Card, Field, ImageUpload } from "../ui";

const NEW_PRODUCT: Omit<Product, "id"> = {
  name: "New Product™",
  category: "Category",
  filter: "health",
  bullets: ["Feature one", "Feature two", "Feature three"],
  cta: { label: "Enquire →", href: "#contact" },
};

export default function ProductsEditor() {
  const { content, setContent } = useSiteContent();

  const update = (idx: number, p: Partial<Product>) =>
    setContent((c) => ({
      ...c,
      products: c.products.map((x, i) => (i === idx ? { ...x, ...p } : x)),
    }));

  const remove = (idx: number) =>
    setContent((c) => ({ ...c, products: c.products.filter((_, i) => i !== idx) }));

  const add = () =>
    setContent((c) => ({ ...c, products: [...c.products, { ...NEW_PRODUCT, id: `product-${Date.now()}` }] }));

  return (
    <div className="grid gap-5">
      <p className="text-[13px] text-ink-dim -mb-2">
        Edit the products shown in the bento grid. Images upload straight to{" "}
        <strong>Cloudinary</strong> (unsigned preset) or <strong>Firebase Storage</strong>. Prices
        feed the pricing table automatically.
      </p>

      {content.products.map((p, i) => (
        <Card key={p.id} title={p.name || "Untitled product"} onRemove={() => remove(i)}>
          <div className="grid sm:grid-cols-2 gap-3.5">
            <Field label="ID (slug)" mono value={p.id} onChange={(v) => update(i, { id: v })} />
            <Field label="Product name" value={p.name} onChange={(v) => update(i, { name: v })} />
            <Field label="Category line" value={p.category} onChange={(v) => update(i, { category: v })} />
            <Field
              label="Filter"
              mono
              value={p.filter}
              onChange={(v) => update(i, { filter: (v as Product["filter"]) || "health" })}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            <Field label="Badge (optional)" value={p.badge ?? ""} onChange={(v) => update(i, { badge: v || undefined })} />
            <Field label="CTA label" value={p.cta?.label ?? "Enquire →"} onChange={(v) => update(i, { cta: { ...(p.cta ?? { href: "#contact" }), label: v } })} />
            <Field label="CTA link" mono value={p.cta?.href ?? "#contact"} onChange={(v) => update(i, { cta: { ...(p.cta ?? { label: "Enquire →" }), href: v } })} />
          </div>

          <ImageUpload label="Product image" value={p.image ?? ""} onChange={(url) => update(i, { image: url })} />

          <div>
            <span className="block text-[12px] font-bold uppercase tracking-wide text-ink-dim mb-1.5">
              Bullet points
            </span>
            <div className="grid gap-2">
              {p.bullets.map((b, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Field value={b} onChange={(v) => update(i, { bullets: p.bullets.map((x, k) => (k === j ? v : x)) })} />
                  <button onClick={() => update(i, { bullets: p.bullets.filter((_, k) => k !== j) })} className="shrink-0 rounded-lg p-2 text-[11px] font-bold text-crimson hover:bg-crimson/10">
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <AddButton onClick={() => update(i, { bullets: [...p.bullets, "New benefit"] })}>
              Add bullet
            </AddButton>
          </div>

          <div className="grid sm:grid-cols-3 gap-3.5">
            <Field label="Price 50ml" mono value={p.price50 ?? ""} onChange={(v) => update(i, { price50: v || undefined })} />
            <Field label="Price 100ml" mono value={p.price100 ?? ""} onChange={(v) => update(i, { price100: v || undefined })} />
            <Field label="Price 200ml" mono value={p.price200 ?? ""} onChange={(v) => update(i, { price200: v || undefined })} />
          </div>
        </Card>
      ))}

      <AddButton onClick={add}>Add product</AddButton>
    </div>
  );
}
