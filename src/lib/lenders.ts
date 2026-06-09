/**
 * Education loan lenders — structured data for the comparison page.
 *
 * Ranges are based on publicly disclosed rates as of mid-2026. Updates needed
 * periodically; the page itself displays a "Updated [date]" badge so users
 * know freshness. Last review date below.
 */

export interface Lender {
  id:                 string;
  slug:               string;
  name:               string;
  shortName:          string;
  logoColor:          string;        // brand color hex (for placeholder logo)
  type:               "bank" | "nbfc" | "fintech-india" | "fintech-global";
  bestFor:            string;        // 1 line — appears as badge
  bestForCategory:    "no-collateral" | "low-interest" | "fast-approval" | "no-cosigner" | "high-amount" | "psu";

  // Numbers (for the comparison table)
  interestRateMin:    number;        // % p.a.
  interestRateMax:    number;        // % p.a.
  maxAmountInr:       string;        // e.g. "₹1.5 Cr"
  processingFeePct:   string;        // e.g. "1-1.5%"
  approvalDays:       string;        // e.g. "7-10 days"
  collateral:         "required" | "optional" | "not-required";
  moratorium:         string;        // e.g. "Course + 6 months"
  countriesCovered:   string;        // e.g. "All countries" or "USA, Canada, UK, AUS"

  // Soft attributes
  prosLine:           string[];      // 2-3 short bullets
  consLine:           string[];      // 2-3 short bullets
  whoShouldApply:     string;        // 1-2 sentences

  // Links
  officialUrl:        string;
  ourReviewSlug?:     string;        // existing post about this lender
  applyCtaLabel:      string;
}

export const LAST_REVIEWED = "2026-06-09";

export const LENDERS: Lender[] = [
  {
    id: "hdfc-credila",
    slug: "hdfc-credila",
    name: "HDFC Credila",
    shortName: "HDFC Credila",
    logoColor: "#004C8F",
    type: "nbfc",
    bestFor: "Largest education-loan NBFC in India",
    bestForCategory: "high-amount",
    interestRateMin: 10.25,
    interestRateMax: 12.50,
    maxAmountInr: "₹1.5 Cr",
    processingFeePct: "1-1.5%",
    approvalDays: "7-10 days",
    collateral: "optional",
    moratorium: "Course + 6 months",
    countriesCovered: "All countries",
    prosLine: [
      "Education-loan specialist (only does this)",
      "Loans up to ₹1.5 Cr for premier universities",
      "Online application + tracking",
    ],
    consLine: [
      "Higher rates than PSU banks",
      "Processing fee non-refundable",
    ],
    whoShouldApply: "Students admitted to top-tier US/UK/Canada universities who need ₹50L+. Strong choice if you have a co-applicant with good CIBIL.",
    officialUrl: "https://www.hdfccredila.com/",
    ourReviewSlug: "hdfc-credila-education-loan-2025-26-complete-guide",
    applyCtaLabel: "Apply with Credila",
  },
  {
    id: "avanse",
    slug: "avanse",
    name: "Avanse Financial Services",
    shortName: "Avanse",
    logoColor: "#E31C25",
    type: "nbfc",
    bestFor: "Loans for non-premier universities too",
    bestForCategory: "fast-approval",
    interestRateMin: 11.00,
    interestRateMax: 14.00,
    maxAmountInr: "₹75 L",
    processingFeePct: "1.5-2%",
    approvalDays: "5-7 days",
    collateral: "optional",
    moratorium: "Course + 6 months",
    countriesCovered: "All countries",
    prosLine: [
      "Faster approval than banks",
      "Accepts non-premier universities",
      "Digital-first process",
    ],
    consLine: [
      "Higher interest than HDFC Credila",
      "Lower max loan amount",
    ],
    whoShouldApply: "Students who didn't get into the top-50 universities or need fast disbursement. Good for shorter programs.",
    officialUrl: "https://www.avanse.com/",
    applyCtaLabel: "Apply with Avanse",
  },
  {
    id: "auxilo",
    slug: "auxilo",
    name: "Auxilo Finserve",
    shortName: "Auxilo",
    logoColor: "#FF6B35",
    type: "nbfc",
    bestFor: "Niche programs (medicine, design, music)",
    bestForCategory: "no-collateral",
    interestRateMin: 11.50,
    interestRateMax: 14.50,
    maxAmountInr: "₹50 L",
    processingFeePct: "1.5-2%",
    approvalDays: "7-14 days",
    collateral: "optional",
    moratorium: "Course + 6 months",
    countriesCovered: "All countries",
    prosLine: [
      "Approves niche & non-STEM courses",
      "Flexible eligibility",
      "Pre-admission loans available",
    ],
    consLine: [
      "Smaller team — slower customer service",
      "Lower max amount",
    ],
    whoShouldApply: "Students applying to medicine, design, music, fashion, or other non-traditional programs that big banks reject.",
    officialUrl: "https://auxilo.com/",
    applyCtaLabel: "Apply with Auxilo",
  },
  {
    id: "prodigy",
    slug: "prodigy-finance",
    name: "Prodigy Finance",
    shortName: "Prodigy",
    logoColor: "#1E5AAE",
    type: "fintech-global",
    bestFor: "No co-signer, no collateral",
    bestForCategory: "no-cosigner",
    interestRateMin: 9.50,
    interestRateMax: 13.00,
    maxAmountInr: "₹85 L (~$100k)",
    processingFeePct: "5% (one-time, in USD)",
    approvalDays: "21-30 days",
    collateral: "not-required",
    moratorium: "Course + 6 months (interest accrues)",
    countriesCovered: "USA, UK, Canada (premier MBA + Masters only)",
    prosLine: [
      "No collateral, no co-signer required",
      "Funds available in USD/GBP directly",
      "Borderless application",
    ],
    consLine: [
      "Only for top universities (200+ approved schools)",
      "Higher all-in cost due to processing fee + USD rates",
      "Interest accrues during studies",
    ],
    whoShouldApply: "Students admitted to top-200 MBA/Masters programs (Stanford GSB, INSEAD, HEC, LSE, etc.) without family collateral.",
    officialUrl: "https://prodigyfinance.com/",
    applyCtaLabel: "Apply with Prodigy",
  },
  {
    id: "mpower",
    slug: "mpower",
    name: "MPOWER Financing",
    shortName: "MPOWER",
    logoColor: "#0EAA48",
    type: "fintech-global",
    bestFor: "US universities, fixed-rate loans",
    bestForCategory: "no-cosigner",
    interestRateMin: 12.99,
    interestRateMax: 15.99,
    maxAmountInr: "₹85 L (~$100k)",
    processingFeePct: "5% (admin fee, deducted upfront)",
    approvalDays: "14-21 days",
    collateral: "not-required",
    moratorium: "Course + 6 months (interest accrues)",
    countriesCovered: "USA, Canada (350+ universities)",
    prosLine: [
      "No co-signer, no collateral",
      "Fixed interest rate (predictable)",
      "Builds US credit history",
    ],
    consLine: [
      "Higher interest than Indian NBFCs",
      "Only for 1-2 years of study",
      "5% admin fee reduces disbursement",
    ],
    whoShouldApply: "Students going to USA/Canada graduate programs without family collateral. Strong choice for STEM Masters students.",
    officialUrl: "https://www.mpowerfinancing.com/",
    applyCtaLabel: "Apply with MPOWER",
  },
  {
    id: "sbi",
    slug: "sbi-global-edvantage",
    name: "SBI Global Ed-vantage",
    shortName: "SBI",
    logoColor: "#22409A",
    type: "bank",
    bestFor: "Lowest interest (PSU bank)",
    bestForCategory: "low-interest",
    interestRateMin: 8.50,
    interestRateMax: 11.00,
    maxAmountInr: "₹1.5 Cr",
    processingFeePct: "₹10,000 (flat)",
    approvalDays: "30-45 days",
    collateral: "required",
    moratorium: "Course + 1 year",
    countriesCovered: "All countries",
    prosLine: [
      "Lowest interest rates in the market",
      "Government-backed (safest)",
      "Tax benefit under Section 80E",
    ],
    consLine: [
      "Collateral mandatory above ₹7.5 L",
      "Slow approval (paperwork heavy)",
      "Branch visit required",
    ],
    whoShouldApply: "Students whose families have property to pledge as collateral and can wait 30-45 days. Lowest total cost if you qualify.",
    officialUrl: "https://sbi.co.in/web/personal-banking/loans/education-loans/global-ed-vantage",
    applyCtaLabel: "Visit SBI Branch",
  },
  {
    id: "icici",
    slug: "icici-bank",
    name: "ICICI Bank",
    shortName: "ICICI",
    logoColor: "#B02A30",
    type: "bank",
    bestFor: "Best private bank option",
    bestForCategory: "low-interest",
    interestRateMin: 10.50,
    interestRateMax: 12.50,
    maxAmountInr: "₹1 Cr",
    processingFeePct: "1% + GST",
    approvalDays: "10-15 days",
    collateral: "required",
    moratorium: "Course + 6 months",
    countriesCovered: "All countries",
    prosLine: [
      "Private bank speed with bank-level rates",
      "Pre-approved for select universities",
      "Doorstep service",
    ],
    consLine: [
      "Collateral above ₹40 L",
      "Higher than SBI",
    ],
    whoShouldApply: "Students who want a private-bank experience without going to NBFCs. Good for HSBC/ICICI Premium account holders.",
    officialUrl: "https://www.icicibank.com/personal-banking/loans/education-loan",
    applyCtaLabel: "Apply with ICICI",
  },
  {
    id: "incred",
    slug: "incred",
    name: "InCred",
    shortName: "InCred",
    logoColor: "#1E40AF",
    type: "fintech-india",
    bestFor: "Fully digital application",
    bestForCategory: "fast-approval",
    interestRateMin: 11.25,
    interestRateMax: 14.00,
    maxAmountInr: "₹60 L",
    processingFeePct: "1-1.5%",
    approvalDays: "3-7 days",
    collateral: "optional",
    moratorium: "Course + 6 months",
    countriesCovered: "All countries",
    prosLine: [
      "100% digital — no branch visit",
      "Fastest approval in this list",
      "Co-signer can be remote",
    ],
    consLine: [
      "Lower max amount",
      "Higher rates than banks",
    ],
    whoShouldApply: "Students applying to short courses or who got admission late and need fast disbursement.",
    officialUrl: "https://www.incred.com/products/education-loans",
    applyCtaLabel: "Apply with InCred",
  },
];

/** Best-of categories used to feature lenders on the page */
export const BEST_OF_CATEGORIES = [
  { id: "low-interest",   label: "Lowest interest rate",          icon: "💰" },
  { id: "no-collateral",  label: "Without collateral",             icon: "🔓" },
  { id: "no-cosigner",    label: "Without co-signer",              icon: "👤" },
  { id: "fast-approval",  label: "Fastest approval",               icon: "⚡" },
  { id: "high-amount",    label: "Largest loan amount",            icon: "🎯" },
] as const;
