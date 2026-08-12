"use client";

import { useState } from "react";
import { ImagePlus, Link2, Trash2, X } from "lucide-react";
import { uploadImage, type UploadTarget } from "@/lib/uploads";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  mono,
  rows = 2,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  mono?: boolean;
  rows?: number;
}) {
  const base =
    "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/20 transition";
  const monoCls = mono ? "font-mono text-[13px]" : "";
  if (textarea) {
    return (
      <label className="block">
        {label && <span className="block text-[12px] font-bold uppercase tracking-wide text-ink-dim mb-1.5">{label}</span>}
        <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${base} ${monoCls} resize-y min-h-[64px]`} />
      </label>
    );
  }
  return (
    <label className="block">
      {label && <span className="block text-[12px] font-bold uppercase tracking-wide text-ink-dim mb-1.5">{label}</span>}
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${base} ${monoCls}`} />
    </label>
  );
}

export function Card({
  title,
  subtitle,
  children,
  onRemove,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-cream/60 p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-[17px] text-ink">{title}</h3>
          {subtitle && <p className="text-[12.5px] text-ink-dim mt-0.5">{subtitle}</p>}
        </div>
        {onRemove && (
          <button onClick={onRemove} className="p-2 rounded-lg text-crimson hover:bg-crimson/10 transition" aria-label="Remove">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div className="grid gap-3.5">{children}</div>
    </div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="self-start inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-magenta/40 px-4 py-2 text-[13px] font-bold text-magenta-deep hover:bg-magenta/5 transition"
    >
      + {children}
    </button>
  );
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}) {
  const [target, setTarget] = useState<UploadTarget>("cloudinary");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const res = await uploadImage(file, target);
      onChange(res.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wide text-ink-dim">{label}</span>
        <div className="flex rounded-lg overflow-hidden border border-line text-[11px] font-bold">
          <button
            onClick={() => setTarget("cloudinary")}
            className={`px-3 py-1.5 transition ${target === "cloudinary" ? "bg-magenta text-white" : "bg-white text-ink-dim"}`}
          >
            Cloudinary
          </button>
          <button
            onClick={() => setTarget("firebase")}
            className={`px-3 py-1.5 transition ${target === "firebase" ? "bg-magenta text-white" : "bg-white text-ink-dim"}`}
          >
            Firebase
          </button>
        </div>
      </div>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full aspect-video object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-ink/70 px-3 py-2 backdrop-blur-sm">
            <button
              onClick={() => {
                const url = window.prompt("Paste an image URL");
                if (url) onChange(url);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-white/25 transition"
            >
              <Link2 size={12} /> Change URL
            </button>
            <button
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-white/25 transition"
            >
              <X size={12} /> Clear
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-center transition ${
            drag ? "border-magenta bg-magenta/5" : "border-line bg-white hover:border-magenta/50"
          }`}
        >
          {busy ? (
            <span className="text-[13px] font-bold text-magenta-deep animate-pulse">Uploading…</span>
          ) : (
            <>
              <ImagePlus size={22} className="text-ink-dim" />
              <span className="text-[12.5px] font-bold text-ink-dim">
                {hint ?? "Drop an image or click to upload"}
              </span>
              <span className="text-[11px] text-ink-dim/70">Uploads to {target}</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
      {error && <p className="text-[12px] text-crimson">{error}</p>}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-[13px] font-bold text-ink"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-magenta" : "bg-ink/15"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
      {label}
    </button>
  );
}
