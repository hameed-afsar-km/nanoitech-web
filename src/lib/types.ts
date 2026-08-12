export interface Cta {
  label: string;
  href: string;
}

export type ProductFilter = "aqua" | "health" | "personal";

export interface Product {
  id: string;
  name: string;
  category: string;
  filter: ProductFilter;
  bullets: string[];
  image?: string;
  badge?: string;
  cta?: Cta;
  price50?: string;
  price100?: string;
  price200?: string;
}

export interface Stat {
  num: string;
  label: string;
}

export interface CoreArea {
  icon: string;
  text: string;
}

export interface TechnologyStep {
  num: string;
  title: string;
  desc: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  utilityBar: {
    items: string[];
    follow: string;
  };
  nav: {
    brandName: string;
    brandTag: string;
    links: NavLink[];
    cta: string;
  };
  hero: {
    eyebrow: string;
    title1: string;
    accent1: string;
    accent2: string;
    lede: string;
    features: { icon: string; label: string }[];
    primaryCta: Cta;
    secondaryCta: Cta;
    featuredProductId?: string;
  };
  trustStrip: { icon: string; text: string }[];
  about: {
    eyebrow: string;
    title: string;
    description: string;
    stats: Stat[];
    visionTitle: string;
    vision: string;
    missionTitle: string;
    missionItems: string[];
    coreAreas: CoreArea[];
  };
  storyCredits: string[];
  technology: {
    eyebrow: string;
    title: string;
    description: string;
    steps: TechnologyStep[];
  };
  products: Product[];
  pricingNote: string;
  contact: {
    title: string;
    description: string;
    email: string;
    secondary: Cta;
    whatsapp?: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    disclaimer: string;
    email: string;
    phone: string;
  };
}
