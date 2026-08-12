"use client";

import { useSiteContent } from "@/lib/site-content-context";
import { Card, Field } from "../ui";

export default function MetaEditor() {
  const { content, setContent } = useSiteContent();

  return (
    <div className="grid gap-5">
      <Card title="Page Meta" subtitle="Browser title and SEO description">
        <Field
          label="Title"
          value={content.meta.title}
          onChange={(v) => setContent((c) => ({ ...c, meta: { ...c.meta, title: v } }))}
        />
        <Field
          label="Description"
          textarea
          rows={3}
          value={content.meta.description}
          onChange={(v) => setContent((c) => ({ ...c, meta: { ...c.meta, description: v } }))}
        />
      </Card>
    </div>
  );
}
