"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  ExternalLink,
  History,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageSquare,
  Package,
  PanelTop,
  RotateCcw,
  Save,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Atom,
  Undo2,
} from "lucide-react";
import {
  getAuthClient,
  googleAuthProvider,
  isAdminEmail,
  isFirebaseConfigured,
} from "@/lib/firebase";
import {
  SiteContentProvider,
  useSiteContent,
  type ChangeLogEntry,
} from "@/lib/site-content-context";
import NavEditor from "./editors/nav-editor";
import HeroEditor from "./editors/hero-editor";
import AboutEditor from "./editors/about-editor";
import TechnologyEditor from "./editors/technology-editor";
import ProductsEditor from "./editors/products-editor";
import ContactEditor from "./editors/contact-editor";
import MetaEditor from "./editors/meta-editor";

type TabKey =
  | "overview"
  | "branding"
  | "hero"
  | "about"
  | "technology"
  | "products"
  | "contact"
  | "meta"
  | "history";

const TAB_META: Record<
  TabKey,
  { label: string; short: string; desc: string; icon: React.ReactNode }
> = {
  overview: {
    label: "Dashboard",
    short: "Home",
    desc: "What's live, what's changed & how publishing works",
    icon: <LayoutDashboard size={16} />,
  },
  products: {
    label: "Products",
    short: "Products",
    desc: "Your catalog — names, photos, prices & details",
    icon: <Package size={16} />,
  },
  branding: {
    label: "Top Bar & Menu",
    short: "Menu",
    desc: "Logo text, menu links & the announcement ticker",
    icon: <PanelTop size={16} />,
  },
  hero: {
    label: "Homepage Hero",
    short: "Hero",
    desc: "The big first section visitors see",
    icon: <Sparkles size={16} />,
  },
  about: {
    label: "About Section",
    short: "About",
    desc: "Company story, stats, mission & vision",
    icon: <Leaf size={16} />,
  },
  technology: {
    label: "Technology Section",
    short: "Technology",
    desc: "How your nanoemulsion science is explained",
    icon: <Atom size={16} />,
  },
  contact: {
    label: "Contact & Footer",
    short: "Contact",
    desc: "Contact channels & footer content",
    icon: <MessageSquare size={16} />,
  },
  meta: {
    label: "SEO Settings",
    short: "SEO",
    desc: "Browser-tab title & Google search description",
    icon: <Settings2 size={16} />,
  },
  history: {
    label: "Activity Log",
    short: "Log",
    desc: "Every staged change, with restore points",
    icon: <History size={16} />,
  },
};

const CONTENT_KEYS: TabKey[] = ["products", "hero", "about", "technology", "branding", "contact"];

const NAV_GROUPS: { label?: string; keys: TabKey[] }[] = [
  { keys: ["overview"] },
  { label: "Edit Website", keys: CONTENT_KEYS },
  { label: "More", keys: ["history", "meta"] },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function LoginCard() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(getAuthClient(), googleAuthProvider);
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/operation-not-allowed") {
        setError(
          "Google sign-in is not enabled for this Firebase project. Ask the project owner to enable it in Firebase Console → Authentication → Sign-in method → Google, then try again.",
        );
      } else if (code === "auth/popup-blocked") {
        setError(
          "The sign-in popup was blocked by your browser. Allow popups for this site and try again.",
        );
      } else if (code === "auth/popup-closed-by-user") {
        setError(
          "The sign-in popup was closed before signing in. Try again.",
        );
      } else {
        setError(
          e instanceof Error ? e.message : "Sign-in failed. Please try again.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center dot-grid-bg bg-cream p-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-md rounded-[28px] border border-line bg-white p-10 text-center shadow-[0_40px_90px_-40px_rgba(17,17,17,0.3)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand-logo.png" alt="" className="mx-auto mb-6 h-8 w-auto" />
        <h1 className="font-display text-[26px] font-semibold tracking-tight text-ink">
          Nano I Admin
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">
          Sign in with your Google account to manage the site content.
        </p>
        <button
          onClick={signIn}
          disabled={busy}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-magenta via-magenta-deep to-orange py-3.5 text-[13.5px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(214,35,107,0.35)] disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <ShieldCheck size={16} />
          {busy ? "Signing in…" : "Continue with Google"}
        </button>
        {error && (
          <p className="mt-5 rounded-xl bg-crimson/10 px-4 py-3 text-left text-[12.5px] leading-relaxed text-crimson">
            {error}
          </p>
        )}
        <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
          Authorized accounts only
        </p>
      </motion.div>
    </div>
  );
}

function NotAuthorized({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center dot-grid-bg bg-cream p-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-md rounded-[28px] border border-line bg-white p-10 text-center shadow-[0_40px_90px_-40px_rgba(17,17,17,0.3)]"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson/10 text-crimson">
          <ShieldAlert size={26} />
        </div>
        <h1 className="font-display text-[22px] font-semibold text-ink">Access denied</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">
          You&apos;re signed in as <strong className="text-ink">{user.email}</strong>, but this
          account isn&apos;t authorized to manage the site. If you believe this is a mistake,
          contact the site owner.
        </p>
        <button
          onClick={onSignOut}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 text-[13px] font-bold text-ink-dim transition hover:border-ink hover:text-ink"
        >
          <LogOut size={15} /> Sign out
        </button>
      </motion.div>
    </div>
  );
}

function StatusTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 transition hover:border-black/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
      {children}
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (t: TabKey) => void }) {
  const { content, live, loadedFromRemote, resetToDefaults } = useSiteContent();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="grid gap-5">
      {/* Status tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusTile label="Firestore">
          <div
            className={`inline-flex items-center gap-2 text-[13.5px] font-bold ${live ? "text-green-deep" : "text-orange-deep"}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${live ? "bg-green" : "bg-orange"} animate-pulse`}
            />
            {live ? "Live" : "Unreachable"}
          </div>
        </StatusTile>
        <StatusTile label="Content source">
          <div className="text-[13.5px] font-bold text-ink">
            {loadedFromRemote ? "Firestore" : "Built-in defaults"}
          </div>
        </StatusTile>
        <StatusTile label="Staged content">
          <div className="text-[13.5px] font-bold text-ink">
            {content.products.length} products · {content.nav.links.length} links
          </div>
        </StatusTile>
        <StatusTile label="Public site">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-magenta-deep hover:underline"
          >
            Open website <ExternalLink size={13} />
          </a>
        </StatusTile>
      </div>

      {/* Quick jump */}
      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-[17px] font-semibold text-ink mb-4">
          Jump to a section
        </h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {CONTENT_KEYS.map((k) => {
            const m = TAB_META[k];
            return (
              <button
                key={k}
                onClick={() => onNavigate(k)}
                className="group flex items-center gap-3 rounded-xl border border-line bg-cream/50 px-4 py-3.5 text-left transition hover:border-magenta/40 hover:bg-magenta-light cursor-pointer"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-ink-dim border border-line transition group-hover:text-magenta-deep group-hover:border-magenta/30">
                  {m.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-bold text-ink">
                    {m.label}
                  </span>
                  <span className="block truncate text-[11.5px] text-ink-muted">{m.desc}</span>
                </span>
                <ExternalLink
                  size={13}
                  className="ml-auto shrink-0 text-ink-muted/50 transition group-hover:text-magenta-deep"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* How this works */}
      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-[17px] font-semibold text-ink mb-4">
          How publishing works
        </h3>
        <ol className="grid gap-3.5">
          {[
            <>
              Edit any section in the sidebar — changes are{" "}
              <strong className="text-ink">staged locally</strong> until published.
            </>,
            <>
              Upload images from product editors — they go to <strong>Cloudinary</strong>{" "}
              (unsigned preset <code className="font-mono text-[12px]">nano-web</code>) or{" "}
              <strong>Firebase Storage</strong>.
            </>,
            <>
              Hit <strong>Save &amp; Publish</strong> (or press{" "}
              <kbd className="rounded-md border border-line bg-cream px-1.5 py-0.5 font-mono text-[11px]">
                Ctrl S
              </kbd>
              ) to write everything to Firestore document{" "}
              <code className="font-mono text-[12px]">site/content</code>. The public site
              updates live.
            </>,
          ].map((node, i) => (
            <li key={i} className="flex gap-3.5 text-[13.5px] leading-relaxed text-ink-dim">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-magenta to-orange text-[11px] font-extrabold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{node}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-crimson/25 bg-crimson/[0.03] p-6">
        <h3 className="font-display text-[16px] font-semibold text-crimson mb-1.5">
          Danger zone
        </h3>
        <p className="text-[13px] leading-relaxed text-ink-dim mb-4">
          Restore the original content that ships with the website. This resets the editor
          only — publish afterwards to apply.
        </p>
        {confirm ? (
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetToDefaults();
                setConfirm(false);
              }}
              className="rounded-full bg-crimson px-5 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 cursor-pointer"
            >
              Yes, reset editor
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="rounded-full border border-line px-5 py-2.5 text-[13px] font-bold text-ink-dim transition hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirm(true)}
            className="inline-flex items-center gap-2 rounded-full border border-crimson/50 px-5 py-2.5 text-[13px] font-bold text-crimson transition hover:bg-crimson/10 cursor-pointer"
          >
            <Undo2 size={15} /> Reset to defaults
          </button>
        )}
      </div>
    </div>
  );
}

function ActivityLog() {
  const { changeLog, undoLast, restoreTo, clearChangeLog, dirty, setContent } = useSiteContent();
  const oldestBefore = changeLog[changeLog.length - 1]?.before;

  const restoreBtn =
    "shrink-0 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11.5px] font-bold text-ink-dim transition hover:border-magenta/40 hover:text-magenta-deep cursor-pointer disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="grid gap-4">
      <p className="-mb-1 text-[13px] leading-relaxed text-ink-dim">
        Every staged change is recorded below. Restoring a point brings the website content
        back to exactly how it was at that moment —{" "}
        <strong className="text-ink">then press Save &amp; Publish to apply.</strong>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={undoLast}
          disabled={!changeLog.length}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-magenta to-orange px-4 py-2 text-[12px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(214,35,107,0.3)] disabled:opacity-40 disabled:hover:translate-y-0 cursor-pointer"
        >
          <Undo2 size={13} /> Undo last change
        </button>
        <button
          onClick={clearChangeLog}
          disabled={!changeLog.length}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12px] font-bold text-ink-dim transition hover:border-crimson/40 hover:text-crimson disabled:opacity-40 cursor-pointer"
        >
          <Trash2 size={13} /> Clear log
        </button>
        {dirty && (
          <span className="rounded-full bg-orange/10 px-3 py-1 text-[11px] font-bold text-orange-deep">
            Unpublished changes staged
          </span>
        )}
      </div>

      {!changeLog.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <History size={24} className="mx-auto mb-3 text-ink-muted" />
          <p className="font-display text-[15px] font-semibold text-ink">No changes yet</p>
          <p className="mt-1 text-[12.5px] text-ink-dim">
            Edits you make in any section will be listed here as restorable points.
          </p>
        </div>
      ) : (
        <ol className="grid gap-2">
          {oldestBefore && (
            <li className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-cream/60 px-4 py-3">
              <span className="w-[86px] shrink-0 font-mono text-[11px] text-ink-muted">start</span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink-dim">
                Before the earliest recorded change
              </span>
              <button
                onClick={() => setContent(oldestBefore, "Restored to start")}
                className={restoreBtn}
              >
                <RotateCcw size={12} /> Restore
              </button>
            </li>
          )}
          {changeLog.map((e) => (
            <li
              key={e.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                e.discrete ? "border-line bg-white hover:border-black/15" : "border-line/60 bg-white/60 hover:border-black/10"
              }`}
            >
              <span className="w-[86px] shrink-0 font-mono text-[11px] text-ink-muted">
                {new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-2">
                {e.discrete && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-magenta" title="Major action" />}
                <span className="truncate text-[13px] font-semibold text-ink">{e.label}</span>
              </span>
              <button onClick={() => restoreTo(e.id)} className={restoreBtn}>
                <RotateCcw size={12} /> Restore
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function UndoToast({ entry, onUndo }: { entry: ChangeLogEntry; onUndo: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: "-50%", scale: 0.96 }}
      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
      exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 z-[60] overflow-hidden rounded-full bg-ink pl-5 pr-2 text-white shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center gap-3 py-2">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 25 }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-magenta"
        >
          <Undo2 size={12} />
        </motion.span>
        <span className="max-w-[300px] truncate text-[13px] font-semibold sm:max-w-[420px]">
          {entry.label}
        </span>
        <button
          onClick={onUndo}
          className="shrink-0 rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-bold transition hover:bg-white/25 cursor-pointer"
        >
          Undo
        </button>
      </div>
      {/* 5s countdown */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        className="h-[3px] origin-left bg-gradient-to-r from-magenta to-orange"
      />
    </motion.div>
  );
}

function TabButton({
  tabKey,
  active,
  onClick,
}: {
  tabKey: TabKey;
  active: boolean;
  onClick: () => void;
}) {
  const m = TAB_META[tabKey];
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-[13.5px] font-bold transition-colors cursor-pointer ${
        active ? "text-magenta-deep" : "text-ink-dim hover:bg-white hover:text-ink"
      }`}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-pill"
          className="absolute inset-0 rounded-xl bg-magenta-light ring-1 ring-magenta/20"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">
        <span className={active ? "text-magenta" : "text-ink-muted"}>{m.icon}</span>
        {m.label}
      </span>
    </button>
  );
}

function Dashboard({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [tab, setTab] = useState<TabKey>("products");
  const { save, saving, dirty, changeLog, undoLast } = useSiteContent();
  const [published, setPublished] = useState(false);
  const [undoEntry, setUndoEntry] = useState<ChangeLogEntry | null>(null);
  const announcedRef = useRef<string | null>(null);

  const publish = useCallback(async () => {
    if (saving) return;
    await save();
    setPublished(true);
    setTimeout(() => setPublished(false), 2500);
  }, [save, saving]);

  /* Ctrl/Cmd+S to publish */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        publish();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [publish]);

  /* Show the 5s undo toast whenever a discrete action is logged */
  useEffect(() => {
    const newest = changeLog[0];
    if (!newest?.discrete || announcedRef.current === newest.id) return;
    announcedRef.current = newest.id;
    setUndoEntry(newest);
  }, [changeLog]);

  /* Auto-dismiss after 5 seconds */
  useEffect(() => {
    if (!undoEntry) return;
    const t = setTimeout(() => setUndoEntry(null), 5000);
    return () => clearTimeout(t);
  }, [undoEntry]);

  const meta = TAB_META[tab];

  return (
    <div className="min-h-screen dot-grid-bg bg-cream">
      {/* Topbar */}
      <header className="sticky top-0 z-40 glass border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand-logo.png" alt="" className="h-7 shrink-0" />
            <div className="min-w-0">
              <div className="truncate font-display text-[15px] font-semibold text-ink">
                Nano I Admin
              </div>
              <div className="hidden truncate text-[11px] text-ink-muted sm:block">
                {meta.label} — {meta.desc}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <AnimatePresence>
              {(dirty || published) && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`hidden rounded-full px-3 py-1 text-[11px] font-bold md:inline-flex ${
                    dirty ? "bg-orange/10 text-orange-deep" : "bg-green-light text-green-deep"
                  }`}
                >
                  {dirty ? "Unsaved changes" : "Published ✓"}
                </motion.span>
              )}
            </AnimatePresence>
            <a
              href="/"
              target="_blank"
              title="Open website"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-dim transition hover:text-ink hover:border-black/20 md:inline-flex"
            >
              <ExternalLink size={15} />
            </a>
            <button
              onClick={publish}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-magenta to-orange px-4 sm:px-5 py-2.5 text-[12.5px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(214,35,107,0.32)] disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
            >
              <Save size={14} />
              <span className="hidden sm:inline">{saving ? "Saving…" : "Save & Publish"}</span>
              <span className="sm:hidden">{saving ? "…" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Mobile tab rail */}
        <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_GROUPS.flatMap((g) => g.keys).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-bold transition-colors cursor-pointer ${
                tab === k ? "text-magenta-deep" : "bg-white text-ink-dim border border-line"
              }`}
            >
              {tab === k && (
                <motion.span
                  layoutId="admin-nav-rail"
                  className="absolute inset-0 rounded-full bg-magenta-light ring-1 ring-magenta/20"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{TAB_META[k].short}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-6 sm:px-6 lg:py-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-24 grid gap-6">
            {NAV_GROUPS.map((g, gi) => (
              <div key={gi} className="grid gap-1">
                {g.label && (
                  <div className="px-3.5 pb-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                    {g.label}
                  </div>
                )}
                {g.keys.map((k) => (
                  <TabButton key={k} tabKey={k} active={tab === k} onClick={() => setTab(k)} />
                ))}
              </div>
            ))}

            {/* Account card */}
            <div className="mt-2 rounded-2xl border border-line bg-white p-3.5">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.photoURL ?? ""} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-bold text-ink">{user.email}</div>
                  <div className="text-[10.5px] font-medium uppercase tracking-wide text-green-deep">
                    Admin
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="shrink-0 rounded-lg p-2 text-ink-dim transition hover:bg-crimson/10 hover:text-crimson cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </div>
              <a
                href="/"
                target="_blank"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-line py-2 text-[12px] font-bold text-ink-dim transition hover:text-ink hover:border-black/20"
              >
                View website <ExternalLink size={12} />
              </a>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 pb-16">
          {dirty && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange/30 bg-orange-light px-5 py-3.5"
            >
              <p className="text-[13px] leading-snug text-orange-deep">
                <strong>You have unpublished changes.</strong>{" "}
                <span className="font-medium text-orange-deep/80">
                  Visitors won&apos;t see them until you publish.
                </span>
              </p>
              <button
                onClick={publish}
                disabled={saving}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-magenta to-orange px-4 py-2 text-[12px] font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(214,35,107,0.3)] disabled:opacity-60 cursor-pointer"
              >
                <Save size={13} /> {saving ? "Saving…" : "Save & Publish"}
              </button>
            </motion.div>
          )}

          <div className="mb-6">
            <h1 className="font-display text-[24px] font-semibold tracking-tight text-ink">
              {meta.label}
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-dim">{meta.desc}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {tab === "overview" && <Overview onNavigate={setTab} />}
              {tab === "branding" && <NavEditor />}
              {tab === "hero" && <HeroEditor />}
              {tab === "about" && <AboutEditor />}
              {tab === "technology" && <TechnologyEditor />}
              {tab === "products" && <ProductsEditor />}
              {tab === "contact" && <ContactEditor />}
              {tab === "meta" && <MetaEditor />}
              {tab === "history" && <ActivityLog />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 5-second undo toast for discrete actions */}
      <AnimatePresence>
        {undoEntry && (
          <UndoToast
            key={undoEntry.id}
            entry={undoEntry}
            onUndo={() => {
              undoLast();
              setUndoEntry(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminGate() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(() => !isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const unsub = onAuthStateChanged(getAuthClient(), (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!isFirebaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center dot-grid-bg bg-cream p-6">
        <div className="max-w-md rounded-[28px] border border-line bg-white p-10 text-center shadow-[0_40px_90px_-40px_rgba(17,17,17,0.3)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-light text-orange-deep">
            <Settings2 size={26} />
          </div>
          <h1 className="font-display text-[22px] font-semibold text-ink">
            Firebase not configured
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">
            Copy <code className="font-mono">.env.example</code> to{" "}
            <code className="font-mono">.env.local</code> and fill in your Firebase keys to enable
            Google sign-in and live content.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-ink-dim">
        <Sparkles className="animate-pulse" size={28} />
      </div>
    );
  }

  if (!user) return <LoginCard />;
  if (!isAdminEmail(user.email))
    return <NotAuthorized user={user} onSignOut={() => signOut(getAuthClient())} />;

  return (
    <Dashboard
      user={user}
      onSignOut={() => {
        signOut(getAuthClient());
      }}
    />
  );
}

export default function AdminDashboard() {
  return (
    <SiteContentProvider>
      <AdminGate />
    </SiteContentProvider>
  );
}
