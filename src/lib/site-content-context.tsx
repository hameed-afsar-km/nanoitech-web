"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CONTENT } from "./defaults";
import { loadContent, saveContent, subscribeContent } from "./content-store";
import type { SiteContent } from "./types";

/** One recorded editor action — a restorable snapshot in time. */
export interface ChangeLogEntry {
  id: string;
  /** Epoch ms when the change happened. */
  at: number;
  /** Human-readable description of the change. */
  label: string;
  /** Discrete actions (delete, add, reorder…) show the 5s undo toast. */
  discrete: boolean;
  /** Full content BEFORE the change (what "Undo" restores). */
  before: SiteContent;
  /** Full content AFTER the change (the retrieval point). */
  after: SiteContent;
}

interface SiteContentContextValue {
  content: SiteContent;
  live: boolean;
  saving: boolean;
  /** True when local edits exist that haven't been published yet. */
  dirty: boolean;
  loadedFromRemote: boolean;
  setContent: (
    action: React.SetStateAction<SiteContent>,
    label?: string,
  ) => void;
  save: () => Promise<void>;
  resetToDefaults: () => void;
  /** Newest-first log of staged changes. */
  changeLog: ChangeLogEntry[];
  /** Revert the most recent logged change. */
  undoLast: () => void;
  /** Stage content exactly as it was right after the given entry. */
  restoreTo: (id: string) => void;
  clearChangeLog: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

/** True for plain objects (not arrays / null). */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Recursively merge a remote (partial) document over the built-in defaults.
 * Missing nested keys keep the default values; provided arrays/values win.
 */
function deepMerge(base: unknown, remote: unknown): unknown {
  if (!isPlainObject(remote)) return base;
  const out: Record<string, unknown> = {
    ...(isPlainObject(base) ? base : {}),
  };
  for (const key of Object.keys(remote)) {
    const rv = remote[key];
    if (rv === undefined) continue;
    out[key] =
      isPlainObject(out[key]) && isPlainObject(rv) ? deepMerge(out[key], rv) : rv;
  }
  return out;
}

/** Merge a remote (partial) document over the built-in defaults. */
function mergeContent(remote: Partial<SiteContent>): SiteContent {
  const base: SiteContent = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  return deepMerge(base, remote) as SiteContent;
}

const MAX_LOG = 60;

const SECTION_NAMES: Record<keyof SiteContent, string> = {
  meta: "SEO settings",
  utilityBar: "Announcement bar",
  nav: "Menu",
  hero: "Homepage hero",
  trustStrip: "Trust strip",
  about: "About section",
  storyCredits: "Story credits",
  technology: "Technology section",
  products: "Products",
  pricingNote: "Pricing note",
  contact: "Contact section",
  footer: "Footer",
};

/** Friendly names of the top-level sections that differ between two snapshots. */
function diffSections(a: SiteContent, b: SiteContent): string[] {
  return (Object.keys(SECTION_NAMES) as (keyof SiteContent)[])
    .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
    .map((k) => SECTION_NAMES[k]);
}

/** Last-known-good remote content, so flaky networks never flash defaults. */
const CACHE_KEY = "nanoitech:content-cache";

function readCache(): Partial<SiteContent> | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Partial<SiteContent>) : null;
  } catch {
    return null;
  }
}

function writeCache(remote: Partial<SiteContent>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(remote));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export function SiteContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(
    () => JSON.parse(JSON.stringify(DEFAULT_CONTENT)),
  );
  const [loadedFromRemote, setLoadedFromRemote] = useState(false);
  const [live, setLive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);

  /* Why the last content change happened. Read by the log effect after each
     commit; remote loads and undo/restore operations never create entries. */
  const pendingRef = useRef<
    { type: "edit"; label?: string } | { type: "remote" } | { type: "system" }
  >({ type: "remote" });
  const prevContentRef = useRef(content);

  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;

    const applyRemote = (remote: Partial<SiteContent> | null) => {
      if (!remote) return;
      pendingRef.current = { type: "remote" };
      setContent(mergeContent(remote));
      writeCache(remote);
      setLoadedFromRemote(true);
    };

    /* Client-only: restore last-known-good content before the
       network round-trip (never during SSR / first render). */
    applyRemote(readCache());

    (async () => {
      const remote = await loadContent();
      if (!active) return;
      if (remote) applyRemote(remote);
    })();

    try {
      unsub = subscribeContent((remote) => {
        if (!active) return;
        if (remote) applyRemote(remote);
        setLive(true);
      });
    } catch {
      /* not configured / no network — keep cached or defaults */
    }

    return () => {
      active = false;
      unsub?.();
    };
  }, []);

  /** Public setter: any edit through it marks content as unpublished and
      is recorded in the change log (optionally with an explicit label —
      labelled changes count as discrete actions and trigger undo toasts). */
  const updateContent = useCallback(
    (action: React.SetStateAction<SiteContent>, label?: string) => {
      pendingRef.current = { type: "edit", label };
      setContent(action);
      setDirty(true);
    },
    [],
  );

  /* Record committed edits into the change log. Typing bursts without an
     explicit label coalesce into one entry after a 1.5s pause. */
  useEffect(() => {
    const kind = pendingRef.current;
    const prev = prevContentRef.current;
    prevContentRef.current = content;
    pendingRef.current = { type: "remote" };
    if (kind.type !== "edit") return;
    if (JSON.stringify(prev) === JSON.stringify(content)) return;

    const now = Date.now();
    setChangeLog((log) => {
      const [last, ...rest] = log;
      if (!kind.label && last && !last.discrete && now - last.at < 1500) {
        return [{ ...last, at: now, after: content }, ...rest];
      }
      const entry: ChangeLogEntry = {
        id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
        at: now,
        label:
          kind.label ??
          `Edited ${diffSections(prev, content).join(", ") || "content"}`,
        discrete: Boolean(kind.label),
        before: prev,
        after: content,
      };
      return [entry, ...log].slice(0, MAX_LOG);
    });
  }, [content]);

  /** Revert the most recent logged change. */
  const undoLast = useCallback(() => {
    const newest = changeLog[0];
    if (!newest) return;
    pendingRef.current = { type: "system" };
    setContent(newest.before);
    setDirty(true);
    setChangeLog((log) => log.slice(1));
  }, [changeLog]);

  /** Stage content exactly as it was right after the given entry. */
  const restoreTo = useCallback(
    (id: string) => {
      const entry = changeLog.find((e) => e.id === id);
      if (!entry) return;
      pendingRef.current = { type: "system" };
      setContent(entry.after);
      setDirty(true);
    },
    [changeLog],
  );

  const clearChangeLog = useCallback(() => setChangeLog([]), []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await saveContent(content);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [content]);

  const resetToDefaults = useCallback(() => {
    updateContent(JSON.parse(JSON.stringify(DEFAULT_CONTENT)));
  }, [updateContent]);

  const value = useMemo(
    () => ({
      content,
      live,
      saving,
      dirty,
      loadedFromRemote,
      setContent: updateContent,
      save,
      resetToDefaults,
      changeLog,
      undoLast,
      restoreTo,
      clearChangeLog,
    }),
    [
      content,
      live,
      saving,
      dirty,
      loadedFromRemote,
      updateContent,
      save,
      resetToDefaults,
      changeLog,
      undoLast,
      restoreTo,
      clearChangeLog,
    ],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
}
