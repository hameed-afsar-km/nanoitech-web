"use client";

import { useRef, useState } from "react";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { uploadImage, type UploadTarget } from "@/lib/uploads";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  mono,
  rows = 2,
  hint,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  mono?: boolean;
  rows?: number;
  hint?: string;
}) {
  const base =
    "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-muted/60 outline-none transition focus:border-magenta/50 focus:ring-[3px] focus:ring-magenta/15 hover:border-black/15";
  const monoCls = mono ? "font-mono text-[13px]" : "";
  const labelEl = label && (
    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-dim">
      {label}
    </span>
  );
  if (textarea) {
    return (
      <label className="block">
        {labelEl}
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${monoCls} min-h-[64px] resize-y`}
        />
        {hint && <span className="mt-1 block text-[11.5px] text-ink-muted">{hint}</span>}
      </label>
    );
  }
  return (
    <label className="block">
      {labelEl}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${base} ${monoCls}`}
      />
      {hint && <span className="mt-1 block text-[11.5px] text-ink-muted">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-ink-dim">
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-xl border border-line bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[position:right_14px_center] bg-no-repeat px-3.5 py-2.5 pr-10 text-[14px] text-ink outline-none transition hover:border-black/15 focus:border-magenta/50 focus:ring-[3px] focus:ring-magenta/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-[11.5px] text-ink-muted">{hint}</span>}
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
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition hover:border-black/10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[16.5px] font-semibold tracking-tight text-ink">
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-muted">{subtitle}</p>}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="rounded-lg p-2 text-crimson/70 transition hover:bg-crimson/10 hover:text-crimson"
            aria-label="Remove"
          >
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
      className="inline-flex items-center gap-1.5 self-start rounded-full border border-dashed border-magenta/40 px-4 py-2 text-[13px] font-bold text-magenta-deep transition hover:border-magenta hover:bg-magenta-light cursor-pointer"
    >
      <Plus size={14} /> {children}
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
  const inputRef = useRef<HTMLInputElement>(null);

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
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-dim">
          {label}
        </span>
        <div className="flex rounded-full border border-line bg-cream p-0.5 text-[11px] font-bold">
          {(["cloudinary", "firebase"] as UploadTarget[]).map((t) => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-full px-3 py-1.5 capitalize transition cursor-pointer ${
                target === t ? "bg-ink text-white" : "text-ink-dim hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {value ? (
        <div
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
          className={`relative overflow-hidden rounded-xl border transition ${
            drag ? "border-magenta ring-[3px] ring-magenta/20" : "border-line"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="aspect-video w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-ink/70 px-3 py-2 backdrop-blur-sm">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-white/25 disabled:opacity-60 cursor-pointer"
            >
              <ImagePlus size={12} /> {busy ? "Uploading…" : "Change image"}
            </button>
            <button
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-white/25 cursor-pointer"
            >
              <X size={12} /> Remove
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
          className={`flex flex-col cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 text-center transition ${
            drag
              ? "border-magenta bg-magenta-light"
              : "border-line bg-cream/50 hover:border-magenta/50 hover:bg-white"
          }`}
        >
          {busy ? (
            <span className="animate-pulse text-[13px] font-bold text-magenta-deep">
              Uploading…
            </span>
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-dim shadow-sm">
                <ImagePlus size={18} />
              </span>
              <span className="text-[12.5px] font-bold text-ink-dim">
                {hint ?? "Drop an image or click to upload"}
              </span>
              <span className="text-[11px] text-ink-muted">Uploads to {target}</span>
            </>
          )}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && <p className="text-[12px] font-medium text-crimson">{error}</p>}
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
      className="inline-flex items-center gap-2.5 text-[13px] font-bold text-ink cursor-pointer"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          checked ? "bg-gradient-to-r from-magenta to-orange" : "bg-ink/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}
