"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Package, Trash2 } from "lucide-react";
import { useSiteContent } from "@/lib/site-content-context";
import type { Product } from "@/lib/types";
import { AddButton, Card, Field, ImageUpload, SelectField } from "../ui";

const NEW_PRODUCT: Omit<Product, "id"> = {
  name: "New Product™",
  category: "Category",
  filter: "health",
  bullets: ["Feature one", "Feature two", "Feature three"],
  cta: { label: "Enquire →", href: "#contact" },
};

const FILTER_OPTIONS = [
  { value: "aqua", label: "Aquaculture" },
  { value: "health", label: "Healthcare" },
  { value: "personal", label: "Personal Care" },
];

export default function ProductsEditor() {
  const { content, setContent } = useSiteContent();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const update = (idx: number, p: Partial<Product>, label?: string) =>
    setContent(
      (c) => ({
        ...c,
        products: c.products.map((x, i) => (i === idx ? { ...x, ...p } : x)),
      }),
      label,
    );

  const remove = (idx: number) => {
    const p = content.products[idx];
    if (!window.confirm(`Delete "${p.name}" from the website?`)) return;
    setContent(
      (c) => ({ ...c, products: c.products.filter((_, i) => i !== idx) }),
      `Deleted “${p.name}”`,
    );
  };

  const move = (idx: number, dir: -1 | 1) =>
    setContent(
      (c) => {
        const next = [...c.products];
        const j = idx + dir;
        if (j < 0 || j >= next.length) return c;
        [next[idx], next[j]] = [next[j], next[idx]];
        return { ...c, products: next };
      },
      "Reordered products",
    );

  const add = () => {
    const id = `product-${Date.now()}`;
    setContent((c) => ({ ...c, products: [...c.products, { ...NEW_PRODUCT, id }] }), "Added product");
    setOpenIds((prev) => new Set(prev).add(id));
  };

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="grid gap-4">
      <p className="-mb-1 text-[13px] leading-relaxed text-ink-dim">
        Click a product below to edit it.{" "}
        <strong className="text-ink">Changes go live only after you press Save&nbsp;&amp;&nbsp;Publish.</strong>
      </p>

      {content.products.map((p, i) => {
        const open = openIds.has(p.id);
        const prices = [p.price50, p.price100, p.price200].filter(Boolean);
        return (
          <div
            key={p.id}
            className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
              open ? "border-magenta/40 shadow-[0_8px_30px_rgba(214,35,107,0.06)]" : "border-line hover:border-black/15"
            }`}
          >
            {/* Summary row — always visible */}
            <div className="flex items-center gap-3 p-3.5">
              <button onClick={() => toggle(p.id)} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5 text-left">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-cream text-ink-muted">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Package size={18} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[15px] font-semibold text-ink">
                    {p.name || "Untitled product"}
                  </span>
                  <span className="block truncate text-[11.5px] text-ink-muted">
                    {[FILTER_OPTIONS.find((f) => f.value === p.filter)?.label ?? p.filter, prices.length ? prices.join(" · ") : "no prices set"]
                      .join(" — ")}
                  </span>
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                  aria-label="Move up"
                  className="rounded-lg p-2 text-ink-muted transition hover:bg-cream hover:text-ink disabled:opacity-25 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === content.products.length - 1}
                  title="Move down"
                  aria-label="Move down"
                  className="rounded-lg p-2 text-ink-muted transition hover:bg-cream hover:text-ink disabled:opacity-25 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronDown size={15} />
                </button>
                <button
                  onClick={() => remove(i)}
                  title="Delete product"
                  aria-label="Delete product"
                  className="rounded-lg p-2 text-crimson/60 transition hover:bg-crimson/10 hover:text-crimson cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => toggle(p.id)}
                  className="ml-1 rounded-full border border-line px-3 py-1.5 text-[11.5px] font-bold text-ink-dim transition hover:border-magenta/40 hover:text-magenta-deep cursor-pointer"
                >
                  {open ? "Close" : "Edit"}
                </button>
              </div>
            </div>

            {/* Expanded form */}
            {open && (
              <div className="border-t border-line bg-cream/40 p-5">
                <div className="grid gap-5">
                  <Card title="Basics">
                    <Field label="Product name" value={p.name} onChange={(v) => update(i, { name: v })} />
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      <SelectField
                        label="Collection"
                        hint="Which tab it appears under on the website"
                        value={p.filter}
                        options={FILTER_OPTIONS}
                        onChange={(v) => update(i, { filter: v as Product["filter"] })}
                      />
                      <Field
                        label="Small label above name"
                        value={p.category}
                        onChange={(v) => update(i, { category: v })}
                      />
                    </div>
                    <Field
                      label="Badge (optional)"
                      hint="e.g. “Bestseller” — leave empty for none"
                      value={p.badge ?? ""}
                      onChange={(v) => update(i, { badge: v || undefined })}
                    />
                  </Card>

                  <Card title="Photo">
                    <ImageUpload label="" value={p.image ?? ""} onChange={(url) => update(i, { image: url })} />
                  </Card>

                  <Card title="Prices" subtitle="Leave a size empty to hide it on the website">
                    <div className="grid grid-cols-3 gap-3.5">
                      <Field label="50 ml" mono value={p.price50 ?? ""} onChange={(v) => update(i, { price50: v || undefined })} />
                      <Field label="100 ml" mono value={p.price100 ?? ""} onChange={(v) => update(i, { price100: v || undefined })} />
                      <Field label="200 ml" mono value={p.price200 ?? ""} onChange={(v) => update(i, { price200: v || undefined })} />
                    </div>
                  </Card>

                  <Card title="Feature bullets" subtitle="Short lines shown inside the product popup">
                    <div className="grid gap-2">
                      {p.bullets.map((b, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Field value={b} onChange={(v) => update(i, { bullets: p.bullets.map((x, k) => (k === j ? v : x)) })} />
                          <button
                            onClick={() =>
                              update(
                                i,
                                { bullets: p.bullets.filter((_, k) => k !== j) },
                                `Removed bullet from “${p.name}”`,
                              )
                            }
                            className="shrink-0 rounded-lg p-2 text-[11px] font-bold text-crimson hover:bg-crimson/10 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <AddButton
                      onClick={() =>
                        update(i, { bullets: [...p.bullets, "New benefit"] }, `Added bullet to “${p.name}”`)
                      }
                    >
                      Add bullet
                    </AddButton>
                  </Card>

                  <details className="group rounded-2xl border border-line bg-white p-5">
                    <summary className="cursor-pointer list-none font-display text-[16.5px] font-semibold tracking-tight text-ink-dim transition group-open:text-ink [&::-webkit-details-marker]:hidden">
                      Advanced (optional)
                    </summary>
                    <div className="mt-4 grid gap-3.5">
                      <div className="grid sm:grid-cols-2 gap-3.5">
                        <Field label="Button text" value={p.cta?.label ?? "Enquire →"} onChange={(v) => update(i, { cta: { ...(p.cta ?? { href: "#contact" }), label: v } })} />
                        <Field label="Button link" mono value={p.cta?.href ?? "#contact"} onChange={(v) => update(i, { cta: { ...(p.cta ?? { label: "Enquire →" }), href: v } })} />
                      </div>
                      <Field
                        label="ID (slug)"
                        hint="Used internally — change only if you know what you're doing"
                        mono
                        value={p.id}
                        onChange={(v) => update(i, { id: v })}
                      />
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <AddButton onClick={add}>Add product</AddButton>
    </div>
  );
}
