"use client";

import { useState, useCallback, useEffect } from "react";
import { SiteContentProvider } from "@/lib/site-content-context";
import { isLowPowerDevice } from "@/lib/device-tier";
import { ProgressBar } from "@/components/site/motion";
import LenisProvider from "./lenis-provider";
import Splash from "./splash";
import Navbar from "./navbar";
import Hero from "./hero";
import About from "./about";
import Story from "./story";
import Technology from "./technology";
import Products from "./products";
import Pricing from "./pricing";
import CtaBand from "./cta";
import Footer from "./footer";

export default function HomeClient() {
  const [splashDone, setSplashDone] = useState(false);
  const onDone = useCallback(() => setSplashDone(true), []);

  useEffect(() => {
    document.documentElement.classList.toggle("lite", isLowPowerDevice());
  }, []);

  return (
    <SiteContentProvider>
      <LenisProvider />
      <ProgressBar />
      <Splash onDone={onDone} />

      <div
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: splashDone ? "auto" : "none",
        }}
      >
        <Navbar />
        <main className="relative z-10 bg-cream">
          <Hero started={splashDone} />
          <About />
          <Story />
          <Technology />
          <Products />
          <Pricing />
          <CtaBand />
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  );
}
