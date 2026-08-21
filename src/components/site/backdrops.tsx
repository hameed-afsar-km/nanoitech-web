"use client";

/* ═══════════════════════════════════════════════════════════════
   SECTION BACKDROPS — v9 (Brand-visible · Topographic)
   Cartographic contour lines tinted in the Nano I palette,
   gradient elevation strata, and a soft tri-color aurora.
   All geometry is deterministic (no random) — SSR-safe.
   ═══════════════════════════════════════════════════════════════ */

const BRAND = {
  magenta: "#d6236b",
  orange: "#e8720c",
  green: "#2f8f4e",
} as const;

type Tint = keyof typeof BRAND;

/* ── Geometry helpers ─────────────────────────────────────────── */
function ringPath(
  cx: number,
  cy: number,
  r0: number,
  wobble: number,
  seed: number,
  steps = 72
): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const n =
      Math.sin(a * 3 + seed) * 0.5 +
      Math.sin(a * 5 + seed * 1.7 + 1.3) * 0.3 +
      Math.sin(a * 8 + seed * 2.9 + 2.1) * 0.2;
    const r = r0 + n * wobble;
    d += `${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * r).toFixed(1)} ${(
      cy + Math.sin(a) * r
    ).toFixed(1)}`;
  }
  return d + " Z";
}

function bandPath(
  yBase: number,
  amp: number,
  seed: number,
  width = 1600,
  steps = 96
): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const n =
      Math.sin(t * Math.PI * 2 * 1.5 + seed) * 0.55 +
      Math.sin(t * Math.PI * 2 * 3.2 + seed * 1.6) * 0.3 +
      Math.sin(t * Math.PI * 2 * 5.7 + seed * 2.4) * 0.15;
    d += `${i === 0 ? "M" : "L"}${(t * width).toFixed(1)} ${(
      yBase + n * amp
    ).toFixed(1)}`;
  }
  return d;
}

/* ── ContourRings — brand-tinted elevation clusters ───────────── */
export function ContourRings({
  className = "",
  tint = "magenta",
  tintAlt,
}: {
  className?: string;
  tint?: Tint;
  tintAlt?: Tint;
}) {
  const cA = BRAND[tint];
  const cB = BRAND[tintAlt ?? tint];
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg className="cr-cluster cr-cluster-tr" viewBox="0 0 800 800" fill="none">
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            d={ringPath(400, 400, 40 + i * 46, 26 + i * 4, 4.2)}
            stroke={cA}
            strokeOpacity={i === 4 ? 0.38 : 0.2}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <svg className="cr-cluster cr-cluster-bl" viewBox="0 0 800 800" fill="none">
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d={ringPath(400, 400, 36 + i * 46, 24 + i * 4, 9.7)}
            stroke={cB}
            strokeOpacity={i === 3 ? 0.34 : 0.18}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <style>{`
        .cr-cluster {
          position: absolute;
          width: min(72vw, 740px);
          aspect-ratio: 1 / 1;
          will-change: transform;
        }
        .cr-cluster-tr {
          top: -34%; right: -20%;
          animation: cr-drift-a 90s ease-in-out infinite alternate;
        }
        .cr-cluster-bl {
          bottom: -40%; left: -22%;
          animation: cr-drift-b 105s ease-in-out infinite alternate;
        }
        @keyframes cr-drift-a {
          from { transform: translate(0, 0) rotate(0deg); }
          to   { transform: translate(-2.5%, 3.5%) rotate(5deg); }
        }
        @keyframes cr-drift-b {
          from { transform: translate(0, 0) rotate(0deg); }
          to   { transform: translate(3%, -2.5%) rotate(-4deg); }
        }
      `}</style>
    </div>
  );
}

/* ── ContourBands — elevation strata in full brand gradient ───── */
export function ContourBands({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const base = dark ? 0.5 : 0.26;
  const accent = dark ? 0.85 : 0.45;
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg
        className="cb-svg"
        viewBox="0 0 1600 640"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="cb-spectrum" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={BRAND.magenta} />
            <stop offset="0.5" stopColor={BRAND.orange} />
            <stop offset="1" stopColor={BRAND.green} />
          </linearGradient>
        </defs>
        {Array.from({ length: 13 }, (_, i) => (
          <path
            key={i}
            d={bandPath(70 + i * 42, 36, 1.8 + i * 0.35)}
            stroke="url(#cb-spectrum)"
            strokeOpacity={i === 6 ? accent : base}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <style>{`
        .cb-svg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          animation: cb-drift 80s ease-in-out infinite alternate;
        }
        @keyframes cb-drift {
          from { transform: translateY(0); }
          to   { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
}

/* ── TriAurora — soft drifting washes in the three brand hues ─── */
export function TriAurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <div className="ta-orb ta-orb-a" />
      <div className="ta-orb ta-orb-b" />
      <div className="ta-orb ta-orb-c" />
      <style>{`
        .ta-orb {
          position: absolute;
          border-radius: 50%;
          will-change: transform;
        }
        .ta-orb-a {
          top: -20%; left: -6%;
          width: 42vw; height: 42vw;
          min-width: 360px; min-height: 360px;
          background: radial-gradient(closest-side, rgba(214,35,107,0.20), rgba(214,35,107,0.10) 45%, transparent 72%);
          animation: ta-a 30s ease-in-out infinite alternate;
        }
        .ta-orb-b {
          top: 8%; right: -10%;
          width: 38vw; height: 38vw;
          min-width: 320px; min-height: 320px;
          background: radial-gradient(closest-side, rgba(232,114,12,0.17), rgba(232,114,12,0.08) 45%, transparent 70%);
          animation: ta-b 36s ease-in-out infinite alternate;
        }
        .ta-orb-c {
          bottom: -24%; left: 26%;
          width: 44vw; height: 44vw;
          min-width: 380px; min-height: 380px;
          background: radial-gradient(closest-side, rgba(47,143,78,0.16), rgba(47,143,78,0.08) 45%, transparent 70%);
          animation: ta-c 42s ease-in-out infinite alternate;
        }
        @keyframes ta-a {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(5vw, 4vh) scale(1.08); }
        }
        @keyframes ta-b {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-4vw, 6vh) scale(1.06); }
        }
        @keyframes ta-c {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(4vw, -5vh) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

/* ── TopLight — soft ambient light falling from above ─────────── */
export function TopLight({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <div className="tl-glow" />
      <style>{`
        .tl-glow {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 62% 48% at 50% -8%, rgba(214,35,107,0.06), transparent 68%),
            radial-gradient(ellipse 45% 38% at 82% -10%, rgba(232,114,12,0.045), transparent 70%);
        }
      `}</style>
    </div>
  );
}

/* ── GrainVeil — fine paper-grain texture ─────────────────────── */
const NOISE_URI =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#g)' opacity='0.5'/></svg>"
  );

export function GrainVeil({
  className = "",
  opacity = 0.18,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`gv-root absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("${NOISE_URI}")`,
        backgroundSize: "180px 180px",
        opacity,
      }}
    />
  );
}
