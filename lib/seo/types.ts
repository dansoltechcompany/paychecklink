import type {
  CountryCode,
  PayFrequency,
  PayType,
  ProvinceCode,
  StateCode,
  UkNation,
} from "../types";

export type PageCategory =
  | "hub"
  | "frequency"
  | "paytype"
  | "tax"
  | "extra"
  | "state"
  | "state-variant"
  | "country"
  | "province"
  | "europe";

export interface PageDefaults {
  country?: CountryCode;
  payType?: PayType;
  payFrequency?: PayFrequency;
  state?: StateCode;
  province?: ProvinceCode;
  ukNation?: UkNation;
  preTax401kPercent?: number;
  overtimeHours?: number;
  bonusAmount?: number;
  grossAmount?: number;
  /** Preload ZIP for local tax (e.g. NYC 10001 on New York pages) */
  zip?: string;
}

export interface PayScenario {
  title: string;
  setup: string;
  annualGross: number;
  netAnnual: number;
  netBiweekly: number;
  effectiveRate: number;
  highlight: string;
}

export interface SEOPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  category: PageCategory;
  defaults?: PageDefaults;
  faqs: { question: string; answer: string }[];
  contentSections: { heading: string; body: string }[];
  stateCode?: StateCode;
  countryCode?: CountryCode;
  scenarios?: PayScenario[];
  priority?: "high" | "normal";
}
