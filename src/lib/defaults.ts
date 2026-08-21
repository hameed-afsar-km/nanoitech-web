import type { SiteContent } from "./types";

export const DEFAULT_CONTENT: SiteContent = {
  meta: {
    title: "Nano I Technology — Innovating Nature Through Nanotechnology",
    description:
      "We blend natural ingredients with proprietary nanoemulsion science to build safe, effective, and sustainable products for aquaculture, healthcare, and personal care.",
  },
  utilityBar: {
    items: [
      "◈ Traditional Wisdom",
      "◈ Modern Science",
      "◈ Nanoemulsion Technology",
      "◈ Natural & Safe",
    ],
    follow: "Follow Us: FB · IG · IN · YT",
  },
  nav: {
    brandName: "NANO I TECHNOLOGY",
    brandTag: "The Third Eye to Visualize, Innovate, and Solve.",
    links: [
      { label: "Home", href: "#top" },
      { label: "About Us", href: "#about" },
      { label: "Technology", href: "#technology" },
      { label: "Products", href: "#products" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
    cta: "Get In Touch",
  },
  hero: {
    eyebrow: "Nanoemulsion Science · Product Line 2026",
    title1: "Innovating Nature",
    accent1: "Through",
    accent2: "Nanotechnology",
    lede: "We blend natural ingredients with proprietary nanoemulsion science to build safe, effective, and sustainable products for aquaculture, healthcare, and personal care.",
    features: [
      { icon: "🌿", label: "100% Natural" },
      { icon: "⚛", label: "Nanoemulsion Technology" },
      { icon: "🛡", label: "Safe & Effective" },
      { icon: "🔬", label: "Science Backed" },
    ],
    primaryCta: { label: "Explore Products →", href: "#products" },
    secondaryCta: { label: "About Our Technology →", href: "#technology" },
    featuredProductId: "nanoshield",
  },
  trustStrip: [
    { icon: "🌱", text: "Premium Herbal\nIngredients" },
    { icon: "⚛", text: "Advanced Nano\nTechnology" },
    { icon: "✅", text: "Rigorous Quality\nStandards" },
    { icon: "🌍", text: "Sustainable &\nEco-Friendly" },
  ],
  about: {
    eyebrow: "About Nano I Technology",
    title: "Nature, nanotechnology, and 20+ years of research",
    description:
      "An innovation-driven biotechnology company developing nanoemulsion-based solutions that combine the power of nature with modern science — improving the stability, delivery, and effectiveness of natural and bioactive ingredients for real-world challenges.",
    stats: [
      { num: "20+", label: "Years of research across India, USA & UK" },
      { num: "50+", label: "International research publications" },
      { num: "5+", label: "Patents in nanoemulsion & related tech" },
      { num: "₹Cr+", label: "Research funding received" },
    ],
    visionTitle: "Our Vision",
    vision:
      "To become a trusted biotechnology company delivering sustainable, science-backed nanoemulsion innovations for health, agriculture, aquaculture, and food applications.",
    missionTitle: "Our Mission",
    missionItems: [
      "Develop effective nanoemulsion technologies using natural and bioactive ingredients",
      "Translate scientific research into practical, high-quality products",
      "Promote sustainable and responsible biotechnology solutions",
      "Create innovations that address real-world challenges across multiple industries",
    ],
    coreAreas: [
      { icon: "🦐", text: "Shrimp Healthcare & Aquaculture" },
      { icon: "🌱", text: "Agricultural Solutions" },
      { icon: "🥗", text: "Food Preservation" },
      { icon: "🦠", text: "Microbial Control" },
      { icon: "🌿", text: "Herbal Personal Care" },
    ],
  },
  storyCredits: [
    "Thirumathi Indirani Thirunavukkarasu",
    "Siddha Vaithiyar Vedivelu Thirukamu",
  ],
  technology: {
    eyebrow: "The Technology",
    title: 'What "nano-delivery" actually means',
    description:
      "Every Nano I product starts as a natural extract or oil — the same actives used in traditional formulations for generations. What changes is the delivery system.",
    steps: [
      {
        num: "01",
        title: "Source the actives",
        desc: "Botanical oils and extracts selected for purity and concentration.",
      },
      {
        num: "02",
        title: "Nano-emulsify",
        desc: "Proprietary processing breaks actives into nanoscale droplets, increasing surface area.",
      },
      {
        num: "03",
        title: "Deliver & absorb",
        desc: "Smaller particles penetrate skin and tissue more readily, improving uptake.",
      },
    ],
  },
  products: [
    {
      id: "nanoshield",
      name: "NanoShield AquaPro+",
      category: "Aquaculture · Shrimp Infection Care",
      filter: "aqua",
      badge: "★ Star Product",
      image: "https://res.cloudinary.com/nckmpyo4/image/upload/v1787339372/products/x2kinsnjrzcwsvqlblsp.jpg",
      bullets: [
        "Boosts growth & survival rates",
        "Prevents & controls bacterial infections",
        "Improves gut health & feed conversion",
      ],
      cta: { label: "Enquire →", href: "#contact" },
      price50: "—",
      price100: "—",
      price200: "—",
    },
    {
      id: "rootique",
      name: "Rootique™",
      category: "Hair Growth & Root Care",
      filter: "personal",
      image: "https://res.cloudinary.com/nckmpyo4/image/upload/v1787339376/products/cnhu9r9qghk8uwb76exr.jpg",
      bullets: [
        "Nourishes hair, strengthens roots",
        "Reduces hair fall",
        "Delays premature greying",
      ],
      cta: { label: "Shop Now →", href: "#pricing" },
      price50: "₹100",
      price100: "₹200",
      price200: "₹400",
    },
    {
      id: "herborelief",
      name: "HerboRelief™",
      category: "Pain Management",
      filter: "health",
      image: "https://res.cloudinary.com/nckmpyo4/image/upload/v1787339379/products/haj07nz0jtnlda5mbj8w.jpg",
      bullets: [
        "Relieves joint & muscle pain",
        "Reduces inflammation",
        "Promotes mobility",
      ],
      cta: { label: "Shop Now →", href: "#pricing" },
      price50: "₹100",
      price100: "₹200",
      price200: "₹300",
    },
    {
      id: "cocorose",
      name: "CocoRosé™",
      category: "Hair Care",
      filter: "personal",
      image: "https://res.cloudinary.com/nckmpyo4/image/upload/v1787339381/products/zgxsobd3dme4sy3ot4uz.jpg",
      bullets: [
        "Deeply nourishes & strengthens",
        "Enhances natural shine",
        "Lightweight, non-greasy formula",
      ],
      cta: { label: "Shop Now →", href: "#pricing" },
      price50: "₹75",
      price100: "₹150",
      price200: "₹300",
    },
    {
      id: "venorestore",
      name: "VenoRestore™",
      category: "Vein & Circulation Care",
      filter: "health",
      image: "https://res.cloudinary.com/nckmpyo4/image/upload/v1787339386/products/d6foc0vjudvugs3lzkcx.jpg",
      bullets: [
        "Supports healthy veins",
        "Improves circulation",
        "Relieves heaviness & fatigue",
      ],
      cta: { label: "Shop Now →", href: "#pricing" },
      price50: "₹150",
      price100: "₹300",
      price200: "₹600",
    },
  ],
  pricingNote:
    "Production-cost and margin figures are tracked internally and left off the public site by design — this table shows consumer-facing retail pricing only.",
  contact: {
    title: "Distributor, retail, or research partner?",
    description:
      "We work with aquaculture farms, healthcare distributors, and personal-care retailers building on nanoemulsion delivery. Let's talk about your market.",
    email: "nanoitechnology@gmail.com",
    secondary: { label: "View Full Portfolio", href: "#products" },
  },
  footer: {
    tagline:
      "The Third Eye to Visualize, Innovate, and Solve. Natural ingredients, engineered at the nanoscale for aquaculture, healthcare, and personal care.",
    copyright: "© 2026 Nano I Technology. All rights reserved.",
    disclaimer:
      "Product formulations shown are for external use only where indicated. Consult product labels for full usage guidance.",
    email: "nanoitechnology@gmail.com",
    phone: "+91 75025 34668",
  },
};
