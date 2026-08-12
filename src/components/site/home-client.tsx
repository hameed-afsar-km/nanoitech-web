"use client";

import { SiteContentProvider } from "@/lib/site-content-context";
import Navbar from "./navbar";
import Hero from "./hero";
import TrustStrip from "./trust-strip";
import About from "./about";
import LogoStory from "./logo-story";
import Story from "./story";
import Technology from "./technology";
import Products from "./products";
import Pricing from "./pricing";
import CtaBand from "./cta";
import Footer from "./footer";

export default function HomeClient() {
  return (
    <SiteContentProvider>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <About />
        <LogoStory />
        <Story />
        <Technology />
        <Products />
        <Pricing />
        <CtaBand />
      </main>
      <Footer />
    </SiteContentProvider>
  );
}
