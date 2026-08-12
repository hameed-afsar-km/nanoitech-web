"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { ExternalLink, LogOut, Save, ShieldAlert, ShieldCheck, Sparkles, Undo2 } from "lucide-react";
import {
  getAuthClient,
  googleAuthProvider,
  isAdminEmail,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { SiteContentProvider, useSiteContent } from "@/lib/site-content-context";
import NavEditor from "./editors/nav-editor";
import HeroEditor from "./editors/hero-editor";
import AboutEditor from "./editors/about-editor";
import TechnologyEditor from "./editors/technology-editor";
import ProductsEditor from "./editors/products-editor";
import ContactEditor from "./editors/contact-editor";
import MetaEditor from "./editors/meta-editor";

type TabKey = "overview" | "branding" | "hero" | "about" | "technology" | "products" | "contact" | "meta";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "branding", label: "Branding & Utility" },
  { key: "hero", label: "Hero & Trust" },
  { key: "about", label: "About & Story" },
  { key: "technology", label: "Technology" },
  { key: "products", label: "Products & Pricing" },
  { key: "contact", label: "Contact & Footer" },
  { key: "meta", label: "Meta" },
];

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
        setError("The sign-in popup was blocked by your browser. Allow popups for this site and try again.");
      } else if (code === "auth/popup-closed-by-user") {
        setError("The sign-in popup was closed before signing in. Try again.");
      } else {
        setError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-6">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-[0_30px_60px_-30px_rgba(28,20,8,0.4)]">
        <div className="mb-6 text-center">
          <div className="grad-magenta mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white">
            <ShieldCheck size={26} />
          </div>
          <h1 className="font-display text-[24px] text-ink">Nano I Admin</h1>
          <p className="mt-1 text-[13.5px] text-ink-dim">
            Sign in with your Google account to manage the site content.
          </p>
        </div>
        <button
          onClick={signIn}
          disabled={busy}
          className="grad-magenta w-full rounded-2xl py-3.5 text-[14px] font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(214,35,107,0.32)] disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Continue with Google"}
        </button>
        {error && <p className="mt-4 rounded-xl bg-crimson/10 px-4 py-3 text-[12.5px] text-crimson">{error}</p>}
      </div>
    </div>
  );
}

function NotAuthorized({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-6">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-[0_30px_60px_-30px_rgba(28,20,8,0.4)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson/10 text-crimson">
          <ShieldAlert size={26} />
        </div>
        <h1 className="font-display text-[22px] text-ink">Access denied</h1>
        <p className="mt-2 text-[13.5px] text-ink-dim">
          You&apos;re signed in as <strong className="text-ink">{user.email}</strong>, but this
          account isn&apos;t authorized to manage the site. If you believe this is a mistake,
          contact the site owner.
        </p>
        <button
          onClick={onSignOut}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-line px-6 py-3 text-[13px] font-bold text-ink-dim hover:bg-cream transition"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );
}

function Overview() {
  const { content, live, loadedFromRemote, resetToDefaults } = useSiteContent();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="grid gap-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="text-[12px] font-bold uppercase tracking-wide text-ink-dim mb-1">Firestore</div>
          <div className={`inline-flex items-center gap-2 text-[14px] font-extrabold ${live ? "text-green-deep" : "text-orange-deep"}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${live ? "bg-green" : "bg-orange"} animate-pulse`} />
            {live ? "Connected (live)" : "Unreachable / not configured"}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="text-[12px] font-bold uppercase tracking-wide text-ink-dim mb-1">Remote content</div>
          <div className="text-[14px] font-extrabold text-ink">{loadedFromRemote ? "Loaded from Firestore" : "Using built-in defaults"}</div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="text-[12px] font-bold uppercase tracking-wide text-ink-dim mb-1">Live preview</div>
          <a href="/" target="_blank" className="inline-flex items-center gap-1.5 text-[14px] font-extrabold text-magenta-deep hover:underline">
            Open website <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="font-display text-[18px] text-ink mb-3">How this works</h3>
        <ol className="list-decimal list-inside text-[13.5px] text-ink-dim grid gap-2">
          <li>Edit any section in the tabs on the left — changes are staged locally.</li>
          <li>Upload images from the product editors — they go to <strong>Cloudinary</strong> (unsigned preset <code className="font-mono text-[12px]">nano-web</code>) or <strong>Firebase Storage</strong>.</li>
          <li>Hit <strong>Save & Publish</strong> to write everything to the Firestore document <code className="font-mono text-[12px]">site/content</code>. The public site updates live.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-crimson/30 bg-crimson/5 p-6">
        <h3 className="font-display text-[17px] text-crimson mb-2">Danger zone</h3>
        <p className="text-[13px] text-ink-dim mb-4">
          Restore the original content that ships with the website (as seen in <code className="font-mono">index.html</code>).
          This resets the editor only — publish afterwards to apply.
        </p>
        {confirm ? (
          <div className="flex gap-3">
            <button onClick={() => { resetToDefaults(); setConfirm(false); }} className="rounded-xl bg-crimson px-5 py-2.5 text-[13px] font-bold text-white hover:opacity-90">
              Yes, reset editor
            </button>
            <button onClick={() => setConfirm(false)} className="rounded-xl border border-line px-5 py-2.5 text-[13px] font-bold text-ink-dim">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className="inline-flex items-center gap-2 rounded-xl border border-crimson px-5 py-2.5 text-[13px] font-bold text-crimson hover:bg-crimson/10 transition">
            <Undo2 size={15} /> Reset to defaults
          </button>
        )}
        <p className="mt-4 text-[12px] text-ink-dim/80">
          {content.products.length} products staged · {content.about.stats.length} stats · {content.nav.links.length} nav links
        </p>
      </div>
    </div>
  );
}

function Dashboard({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [tab, setTab] = useState<TabKey>("overview");
  const { content, save, saving } = useSiteContent();
  const lastSaved = useRef("");
  const [dirty, setDirty] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    setDirty(lastSaved.current !== JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    lastSaved.current = JSON.stringify(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publish = useCallback(async () => {
    await save();
    lastSaved.current = JSON.stringify(content);
    setDirty(false);
    setPublished(true);
    setTimeout(() => setPublished(false), 2500);
  }, [save, content]);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand-logo.png" alt="" className="h-9" />
            <div>
              <div className="font-display text-[16px] font-bold text-magenta-deep">Nano I Admin</div>
              <div className="text-[11px] text-ink-dim">Content management dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {published && <span className="text-[12px] font-bold text-green-deep animate-pulse">Published ✓</span>}
            {dirty && <span className="rounded-full bg-orange/10 px-3 py-1 text-[11px] font-bold text-orange-deep">Unsaved changes</span>}
            <button
              onClick={publish}
              disabled={saving}
              className="grad-magenta inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-[13px] font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(214,35,107,0.32)] disabled:opacity-60"
            >
              <Save size={15} /> {saving ? "Saving…" : "Save & Publish"}
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-cream py-1.5 pl-1.5 pr-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.photoURL ?? ""} alt="" className="h-7 w-7 rounded-full" />
              <span className="text-[12.5px] font-bold text-ink truncate max-w-[160px]">{user.email}</span>
              <button onClick={onSignOut} className="text-ink-dim hover:text-crimson transition" title="Sign out">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row gap-6 px-6 py-6">
        <aside className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-[13.5px] font-bold transition ${
                  tab === t.key ? "grad-magenta text-white shadow-md" : "text-ink-dim hover:bg-white hover:text-magenta-deep"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 pb-16">
          {tab === "overview" && <Overview />}
          {tab === "branding" && <NavEditor />}
          {tab === "hero" && <HeroEditor />}
          {tab === "about" && <AboutEditor />}
          {tab === "technology" && <TechnologyEditor />}
          {tab === "products" && <ProductsEditor />}
          {tab === "contact" && <ContactEditor />}
          {tab === "meta" && <MetaEditor />}
        </main>
      </div>
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
      <div className="flex min-h-screen items-center justify-center bg-cream p-6">
        <div className="max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-lg">
          <h1 className="font-display text-[22px] text-ink">Firebase not configured</h1>
          <p className="mt-2 text-[13.5px] text-ink-dim">
            Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env.local</code> and fill in your
            Firebase keys to enable Google sign-in and live content.
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
  if (!isAdminEmail(user.email)) return <NotAuthorized user={user} onSignOut={() => signOut(getAuthClient())} />;

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
