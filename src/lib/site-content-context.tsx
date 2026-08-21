"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CONTENT } from "./defaults";
import { loadContent, saveContent, subscribeContent } from "./content-store";
import type { SiteContent } from "./types";

interface SiteContentContextValue {
  content: SiteContent;
  live: boolean;
  saving: boolean;
  loadedFromRemote: boolean;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  save: () => Promise<void>;
  resetToDefaults: () => void;
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

  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;

    const applyRemote = (remote: Partial<SiteContent> | null) => {
      if (!remote) return;
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

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await saveContent(content);
    } finally {
      setSaving(false);
    }
  }, [content]);

  const resetToDefaults = useCallback(() => {
    setContent(JSON.parse(JSON.stringify(DEFAULT_CONTENT)));
  }, []);

  const value = useMemo(
    () => ({
      content,
      live,
      saving,
      loadedFromRemote,
      setContent,
      save,
      resetToDefaults,
    }),
    [content, live, saving, loadedFromRemote, save, resetToDefaults],
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
