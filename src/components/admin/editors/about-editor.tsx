"use client";

import { useSiteContent } from "@/lib/site-content-context";
import { AddButton, Card, Field } from "../ui";

export default function AboutEditor() {
  const { content, setContent } = useSiteContent();
  const a = content.about;

  const patch = (p: Partial<typeof a>) =>
    setContent((c) => ({ ...c, about: { ...c.about, ...p } }));

  return (
    <div className="grid gap-5">
      <Card title="About Section" subtitle="Heading, intro and description">
        <Field label="Eyebrow" mono value={a.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <Field label="Title" value={a.title} onChange={(v) => patch({ title: v })} />
        <Field label="Description" textarea rows={4} value={a.description} onChange={(v) => patch({ description: v })} />
      </Card>

      <Card title="Stats" subtitle="Research numbers shown in the bento tiles">
        <div className="grid gap-3.5">
          {a.stats.map((s, i) => (
            <div key={i} className="grid sm:grid-cols-[160px_1fr] gap-3.5">
              <Field label="Number" value={s.num} onChange={(v) => patch({ stats: a.stats.map((x, j) => (j === i ? { ...x, num: v } : x)) })} />
              <Field label="Label" value={s.label} onChange={(v) => patch({ stats: a.stats.map((x, j) => (j === i ? { ...x, label: v } : x)) })} />
            </div>
          ))}
        </div>
        <AddButton onClick={() => patch({ stats: [...a.stats, { num: "10+", label: "New stat" }] })}>
          Add stat
        </AddButton>
      </Card>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card title="Vision" subtitle="Large green bento card">
          <Field label="Title" value={a.visionTitle} onChange={(v) => patch({ visionTitle: v })} />
          <Field label="Vision text" textarea rows={5} value={a.vision} onChange={(v) => patch({ vision: v })} />
        </Card>
        <Card title="Mission" subtitle="Cream bento card with checklist">
          <Field label="Title" value={a.missionTitle} onChange={(v) => patch({ missionTitle: v })} />
          <div className="grid gap-3.5">
            {a.missionItems.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <Field
                  value={m}
                  onChange={(v) => patch({ missionItems: a.missionItems.map((x, j) => (j === i ? v : x)) })}
                />
                <button
                  onClick={() => patch({ missionItems: a.missionItems.filter((_, j) => j !== i) })}
                  className="shrink-0 rounded-lg p-2 text-[11px] font-bold text-crimson hover:bg-crimson/10"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <AddButton onClick={() => patch({ missionItems: [...a.missionItems, "New mission item"] })}>
            Add item
          </AddButton>
        </Card>
      </div>

      <Card title="Core Areas" subtitle="The five focus areas in the bento grid">
        <div className="grid gap-3.5">
          {a.coreAreas.map((c, i) => (
            <div key={i} className="grid sm:grid-cols-[90px_1fr] gap-3.5">
              <Field label="Icon" value={c.icon} onChange={(v) => patch({ coreAreas: a.coreAreas.map((x, j) => (j === i ? { ...x, icon: v } : x)) })} />
              <Field label="Text" value={c.text} onChange={(v) => patch({ coreAreas: a.coreAreas.map((x, j) => (j === i ? { ...x, text: v } : x)) })} />
            </div>
          ))}
        </div>
        <AddButton onClick={() => patch({ coreAreas: [...a.coreAreas, { icon: "🌿", text: "New area" }] })}>
          Add area
        </AddButton>
      </Card>

      <Card title="Story Credits" subtitle="Captions under the two heritage images">
        <div className="grid gap-3.5">
          {content.storyCredits.map((s, i) => (
            <Field
              key={i}
              label={`Credit ${i + 1}`}
              value={s}
              onChange={(v) => setContent((c) => ({ ...c, storyCredits: c.storyCredits.map((x, j) => (j === i ? v : x)) }))}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
