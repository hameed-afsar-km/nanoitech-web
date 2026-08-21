"use client";

/* ═══════════════════════════════════════════════════════════════
   FLORA — hand-drawn nature accents for the hero
   Swaying botanical branches on opposing borders, drifting
   petals and twinkling dew. Transform-only animations.
   ═══════════════════════════════════════════════════════════════ */

const LEAF = "M0 0 C 10 -18 30 -22 46 -10 C 33 7 13 9 0 0 Z";
const PETAL = "M12 2 C 18 6 20 14 12 22 C 4 14 6 6 12 2 Z";

const PETALS: { c: string; o: number; pos: string; d: string; dur: string; s: number }[] = [
  { c: "#d6236b", o: 0.20, pos: "left-[7%] top-[30%]", d: "0s", dur: "7s", s: 16 },
  { c: "#e8720c", o: 0.18, pos: "left-[16%] top-[64%] hidden sm:block", d: "-2.5s", dur: "8s", s: 13 },
  { c: "#2f8f4e", o: 0.24, pos: "right-[9%] top-[24%]", d: "-1.2s", dur: "7.5s", s: 15 },
  { c: "#d6236b", o: 0.15, pos: "right-[21%] top-[66%] hidden sm:block", d: "-4s", dur: "9s", s: 12 },
  { c: "#2f8f4e", o: 0.20, pos: "left-[47%] top-[11%] hidden lg:block", d: "-3.2s", dur: "8.5s", s: 12 },
  { c: "#e8720c", o: 0.17, pos: "left-[36%] bottom-[9%]", d: "-1.8s", dur: "7.8s", s: 14 },
];

export function FloraCorners({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* ── Bottom-left botanical branch ── */}
      <svg className="nat-bl" viewBox="0 0 340 340" fill="none">
        <g className="nat-sway nat-sway-a" style={{ transformOrigin: "24px 330px" }}>
          <path
            d="M24 330 C 96 276, 158 208, 244 74"
            stroke="#2f8f4e" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx="244" cy="74" r="4" fill="#2f8f4e" fillOpacity="0.4" />
          {/* upper leaves */}
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.30" transform="translate(56 304) rotate(-58)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.22" transform="translate(128 236) rotate(-52) scale(1.05)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.30" transform="translate(196 152) rotate(-46) scale(0.95)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.22" transform="translate(236 86) rotate(-40) scale(0.8)" />
          {/* dew */}
          <circle className="nat-dew" cx="112" cy="248" r="3" fill="#7fd39b" />
          <circle className="nat-dew nd-2" cx="178" cy="172" r="2.5" fill="#7fd39b" />
        </g>
        <g className="nat-sway nat-sway-b" style={{ transformOrigin: "24px 330px" }}>
          {/* lower leaves */}
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.18" transform="translate(90 280) rotate(118) scale(0.95)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.26" transform="translate(158 206) rotate(122)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.18" transform="translate(218 126) rotate(126) scale(0.9)" />
        </g>
      </svg>

      {/* ── Top-right trailing vine ── */}
      <svg className="nat-tr" viewBox="0 0 280 280" fill="none">
        <g className="nat-sway nat-sway-b" style={{ transformOrigin: "268px -6px" }}>
          <path
            d="M268 -6 C 224 62, 172 116, 98 182"
            stroke="#2f8f4e" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx="98" cy="182" r="4" fill="#2f8f4e" fillOpacity="0.38" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.24" transform="translate(238 34) rotate(64)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.18" transform="translate(186 96) rotate(58) scale(1.02)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.24" transform="translate(132 146) rotate(52) scale(0.9)" />
          <circle className="nat-dew nd-2" cx="210" cy="66" r="2.5" fill="#7fd39b" />
        </g>
        <g className="nat-sway nat-sway-a" style={{ transformOrigin: "268px -6px" }}>
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.16" transform="translate(214 62) rotate(-118) scale(0.95)" />
          <path d={LEAF} fill="#2f8f4e" fillOpacity="0.22" transform="translate(158 118) rotate(-112) scale(0.9)" />
        </g>
      </svg>

      {/* ── Drifting petals ── */}
      {PETALS.map((p, i) => (
        <svg
          key={i}
          className={`petal-f absolute ${p.pos}`}
          width={p.s}
          height={p.s}
          viewBox="0 0 24 24"
          style={{ animationDelay: p.d, animationDuration: p.dur }}
        >
          <path d={PETAL} fill={p.c} fillOpacity={p.o} />
        </svg>
      ))}

      <style>{`
        .nat-bl {
          position: absolute;
          left: -44px; bottom: -52px;
          width: min(42vw, 420px);
          aspect-ratio: 1 / 1;
        }
        .nat-tr {
          position: absolute;
          top: -38px; right: -32px;
          width: min(32vw, 320px);
          aspect-ratio: 1 / 1;
        }
        .nat-sway { will-change: transform; }
        .nat-sway-a { animation: nat-sway 7s ease-in-out infinite alternate; }
        .nat-sway-b { animation: nat-sway 8.5s ease-in-out infinite alternate; animation-delay: -3s; }
        @keyframes nat-sway {
          from { transform: rotate(-1.6deg); }
          to   { transform: rotate(2deg); }
        }
        .nat-dew { animation: pulse-glow 4.5s ease-in-out infinite; }
        .nat-dew.nd-2 { animation-delay: -2.2s; }
        .petal-f {
          animation-name: petal-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes petal-float {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50%      { transform: translateY(-18px) rotate(6deg); }
        }
      `}</style>
    </div>
  );
}
