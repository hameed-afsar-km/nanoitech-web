"use client";

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { SiteContent } from "./types";

export const CONTENT_PATH = "site/content";

/** Load the content document once (null when missing/unreachable). */
export async function loadContent(): Promise<SiteContent | null> {
  try {
    const snap = await getDoc(doc(getDb(), CONTENT_PATH));
    if (snap.exists()) return snap.data() as SiteContent;
    return null;
  } catch {
    return null;
  }
}

/** Live-subscribe to the content document. Returns an unsubscribe fn. */
export function subscribeContent(
  onData: (content: SiteContent | null) => void,
): Unsubscribe {
  try {
    return onSnapshot(doc(getDb(), CONTENT_PATH), (snap) => {
      if (snap.exists()) onData(snap.data() as SiteContent);
      else onData(null);
    });
  } catch {
    return () => {};
  }
}

/** Persist the content document (merges arrays/objects). */
export async function saveContent(content: SiteContent): Promise<void> {
  /* JSON round-trip strips `undefined` values that Firestore rejects */
  const clean = JSON.parse(JSON.stringify(content)) as SiteContent;
  await setDoc(
    doc(getDb(), CONTENT_PATH),
    { ...clean, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
