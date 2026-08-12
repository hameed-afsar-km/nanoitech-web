"use client";

import { useSiteContent } from "@/lib/site-content-context";
import { AddButton, Card, Field } from "../ui";

export default function TechnologyEditor() {
  const { content, setContent } = useSiteContent();
  const t = content.technology;

  const patch = (p: Partial<typeof t>) =>
    setContent((c) => ({ ...c, technology: { ...c.technology, ...p } }));

  return (
    <div className="grid gap-5">
      <Card title="Technology Section" subtitle="Headline and description of the nano-delivery story">
        <Field label="Eyebrow" mono value={t.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <Field label="Title" value={t.title} onChange={(v) => patch({ title: v })} />
        <Field label="Description" textarea rows={3} value={t.description} onChange={(v) => patch({ description: v })} />
      </Card>

      <Card title="Steps" subtitle="The three numbered process steps">
        <div className="grid gap-5">
          {t.steps.map((s, i) => (
            <div key={i} className="grid gap-3.5 rounded-xl border border-line bg-white p-4">
              <Field label="Number" mono value={s.num} onChange={(v) => patch({ steps: t.steps.map((x, j) => (j === i ? { ...x, num: v } : x)) })} />
              <Field label="Title" value={s.title} onChange={(v) => patch({ steps: t.steps.map((x, j) => (j === i ? { ...x, title: v } : x)) })} />
              <Field label="Description" textarea rows={2} value={s.desc} onChange={(v) => patch({ steps: t.steps.map((x, j) => (j === i ? { ...x, desc: v } : x)) })} />
            </div>
          ))}
        </div>
        <AddButton onClick={() => patch({ steps: [...t.steps, { num: "04", title: "New step", desc: "Description" }] })}>
          Add step
        </AddButton>
      </Card>
    </div>
  );
}
