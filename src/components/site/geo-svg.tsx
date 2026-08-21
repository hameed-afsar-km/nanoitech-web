"use client";

/* ═══════════════════════════════════════════════════════════════
   UI UTILITIES
   ═══════════════════════════════════════════════════════════════ */

/* ── GradientBorderCard — animated gradient border ── */
export function GradientBorderCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-[inherit] p-[1.5px] overflow-hidden">
        <div
          className="absolute inset-[-100%] gradient-border-anim"
          style={{
            background: "conic-gradient(from 0deg, #d6236b, #e8720c, #2f8f4e, #d6236b)",
          }}
        />
      </div>
      <div className="relative bg-white rounded-[inherit]">
        {children}
      </div>
      <style>{`
        .gradient-border-anim {
          animation: gradient-rotate 6s linear infinite;
        }
        @keyframes gradient-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ── OrbitingDots ── */
export function OrbitingDots({ className = "", size = 200 }: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={`absolute pointer-events-none ${className}`} style={{ width: size, height: size }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-ink/10" />
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" style={{ width: size, height: size }}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 10} fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      <div className="absolute inset-0 od-spin">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-magenta/50" />
      </div>
      <div className="absolute inset-0 od-spin" style={{ animationDelay: "-3.33s" }}>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange/50" />
      </div>
      <div className="absolute inset-0 od-spin" style={{ animationDelay: "-6.66s" }}>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green/50" />
      </div>
      <style>{`
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .od-spin { animation: orbit 10s linear infinite; }
      `}</style>
    </div>
  );
}

/* ── Accent Line ── */
export function AccentLine({ className = "", direction = "horizontal" }: {
  className?: string;
  direction?: "horizontal" | "vertical";
}) {
  return (
    <div className={`${className} ${
      direction === "horizontal"
        ? "h-[3px] w-full bg-gradient-to-r from-magenta via-orange to-green"
        : "w-[3px] h-full bg-gradient-to-b from-magenta via-orange to-green"
    }`} />
  );
}

/* ── TriDots ── */
export function TriDots({ className = "", size = "sm" }: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const s = size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : "w-2.5 h-2.5";
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`${s} rounded-full bg-magenta`} />
      <span className={`${s} rounded-full bg-orange`} />
      <span className={`${s} rounded-full bg-green`} />
    </span>
  );
}

/* ── GradientBar ── */
export function GradientBar({ className = "" }: { className?: string }) {
  return (
    <div className={`h-[3px] bg-gradient-to-r from-magenta via-orange to-green rounded-full ${className}`} />
  );
}
