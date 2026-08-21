import type { ReactNode } from "react";

export default function SectionHeader({
  num,
  label,
  title,
  lede,
  accent = "#d6236b",
}: {
  num: string;
  label: string;
  title: ReactNode;
  lede?: string;
  accent?: string;
}) {
  return (
    <div className="mb-16 lg:mb-24">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-6 h-0.5 rounded-full" style={{ background: accent }} />
        <span className="section-label" style={{ color: accent }}>
          {num} — {label}
        </span>
      </div>
      <div className="grid lg:grid-cols-[1fr_340px] gap-x-16 gap-y-6 items-end">
        <h2 className="font-display font-semibold text-ink leading-[1.02] tracking-[-0.03em]"
          style={{ fontSize: "clamp(36px, 5vw, 76px)" }}>
          {title}
        </h2>
        {lede && (
          <p className="text-ink-dim text-[15px] leading-[1.75] font-normal lg:pb-1">
            {lede}
          </p>
        )}
      </div>
    </div>
  );
}
