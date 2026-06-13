/**
 * Course landing pages — /courses/{slug}
 *
 * Target buyer-intent queries that get 5k-30k searches/month each:
 *   - "MS computer science in USA"          (~18k/mo)
 *   - "MBA in UK for indian students"       (~12k/mo)
 *   - "MS data science USA"                 (~8k/mo)
 *   - "PG diploma in canada for indians"    (~6k/mo)
 *
 * Each page is a category-style hub linking to relevant universities,
 * scholarships, posts, and tools.
 */

export const LAST_REVIEWED = "2026-06-12";

export interface CourseData {
  slug:               string;
  course:             string;          // "MS Computer Science"
  degree:             string;          // "Masters"
  country:            string;          // "USA"
  countrySlug:        string;          // "usa" (for cross-link to /study-in/{slug})
  flag:               string;          // "🇺🇸"

  metaTitle:          string;
  metaDescription:    string;
  intro:              string;          // 2-3 sentence intro
  whyChoose:          string[];        // 4-6 reasons

  // Cost + Duration
  durationYears:      string;          // "2 years"
  totalCostINR:       string;          // "₹70 L - 1.5 Cr"
  tuitionAnnualINR:   string;          // "₹35-65 L/year"

  // Admission stats
  intakeMonth:        string;          // "Fall (August)"
  appDeadline:        string;          // "December 1, 2026 (for Fall 2027)"
  englishRequired:    string;          // "IELTS 7.0+ / TOEFL 100+"
  testsRequired:      string[];        // ["GRE 320+", "TOEFL 100+"]

  // Universities (slugs from our university-detail or shortNames)
  topUniversities:    string[];        // ["MIT", "Stanford", "CMU", ...]
  topUniversitySlugs: string[];        // matched slugs for those that have detail pages

  // Career
  popularJobs:        string[];        // ["Software Engineer", "ML Engineer", ...]
  startingSalaryINR:  string;          // "₹85 L - 1.5 Cr"
  postStudyVisa:      string;          // "OPT — 1 year + 24 months STEM"

  // Scholarships (text — we link to /scholarships)
  scholarshipsHint:   string;          // brief mention

  // FAQs (4-5 high-volume questions)
  faqs: { q: string; a: string }[];
}

// ─── COURSE DATA ────────────────────────────────────────────────────────
export const COURSES: CourseData[] = [
  // USA
  {
    slug: "ms-computer-science-usa",
    course: "MS Computer Science",
    degree: "Masters",
    country: "USA",
    countrySlug: "usa",
    flag: "🇺🇸",
    metaTitle: "MS Computer Science in USA 2027: Fees, Top Universities, Jobs for Indian Students",
    metaDescription: "Complete guide to MS Computer Science in USA for Indian students 2027 — tuition ₹35-65 L/year, top universities (MIT, Stanford, CMU), F-1 visa, 3-year STEM OPT, ₹1.3-1.8 Cr starting salaries.",
    intro: "MS in Computer Science from USA is the single most-applied-to program by Indian students — ~30,000 Indians enroll every year. With STEM OPT giving 3 years of post-study work + median salaries of ₹1.5 Cr/year + access to FAANG hiring pipeline, the ROI typically clears the ₹1+ Cr investment within 3-4 years.",
    whyChoose: [
      "Best-in-world programs at MIT, Stanford, CMU, UC Berkeley, Cornell",
      "3-year STEM OPT — work + pay off loans before deciding on H-1B",
      "Median starting salary: $150k-$220k base ($170k median, ~₹1.5 Cr)",
      "FAANG (Google, Meta, Apple) actively recruit top-school grads",
      "Strong Indian alumni network — Sundar Pichai, Satya Nadella, Parag Agrawal",
      "Wide university choice — 40+ programs in top-50 rankings",
    ],
    durationYears: "2 years (some 1.5)",
    totalCostINR: "₹75 L - 1.5 Cr",
    tuitionAnnualINR: "₹35-65 L/year",
    intakeMonth: "Fall (August) — primary; some Spring (January)",
    appDeadline: "December 1 - 15, 2026 (for Fall 2027)",
    englishRequired: "TOEFL 100+ / IELTS 7.0+ / Duolingo 120+",
    testsRequired: ["GRE 320+ (CS programs prefer 325+)", "TOEFL 100+ or IELTS 7.0+"],
    topUniversities: [
      "MIT", "Stanford", "Carnegie Mellon University", "UC Berkeley",
      "Cornell", "UIUC", "Georgia Tech", "University of Washington",
      "Columbia", "Princeton",
    ],
    topUniversitySlugs: [
      "massachusetts-institute-of-technology",
      "stanford-university",
    ],
    popularJobs: [
      "Software Engineer (₹1.3-1.8 Cr)",
      "Machine Learning Engineer (₹1.5-2 Cr)",
      "Data Engineer (₹1.2-1.6 Cr)",
      "Product Manager (₹1.5-2.2 Cr)",
      "Quantitative Researcher (₹2-3 Cr at hedge funds)",
    ],
    startingSalaryINR: "₹1.3 - 1.8 Cr base + bonus + equity",
    postStudyVisa: "F-1 OPT (1 year) + STEM extension (24 months) = 3 years total",
    scholarshipsHint: "Knight-Hennessy at Stanford, Tata Fellowship at MIT, Inlaks Foundation, Fulbright-Nehru, university-specific RA/TA positions (cover ~60% of tuition + stipend)",
    faqs: [
      {
        q: "How much does an MS in Computer Science cost in USA for Indian students?",
        a: "Total cost ranges from ₹75 L (state universities like UT Austin, UMass Amherst) to ₹1.5 Cr+ (Ivy League, Stanford). Tuition alone is ₹35-65 L/year, plus ₹15-20 L/year for living expenses (Bay Area + NYC = highest). A 2-year MS CS typically costs ₹90 L - 1.3 Cr total. Most Indian students fund via education loans (HDFC Credila, SBI) + on-campus RA/TA positions covering 50-100% tuition.",
      },
      {
        q: "What GRE score is needed for MS Computer Science in USA?",
        a: "Top-10 schools (MIT, Stanford, CMU, Berkeley) — admitted Indians typically have GRE 330+ (Quant 169+, Verbal 158+). Top 20-50 schools — 320-328 acceptable. State universities (UT Austin, UMich, Purdue) — 315+ sufficient. GRE is optional at some schools post-2021 but still considered. Strong coding portfolio (GitHub, hackathons) can offset slightly lower GRE.",
      },
      {
        q: "Which is the best university for MS CS in USA for Indian students?",
        a: "For pure research + theory: MIT, Stanford, CMU, Berkeley (in that order by Indian student survey). For applied AI/ML: CMU, Stanford, UIUC. For systems + databases: Berkeley, CMU, Wisconsin-Madison. For software engineering + practical careers: UT Austin, Georgia Tech, UCLA. Best ROI (cheaper + strong placement): UT Austin, UMass Amherst, Purdue, UIUC.",
      },
      {
        q: "What is the average salary after MS CS in USA?",
        a: "Median starting base salary 2026: $170,000/year (~₹1.5 Cr). Total compensation including signing bonus + equity + annual bonus: $190k-260k ($210k median, ~₹1.8 Cr). FAANG: $200-280k total. Mid-tier tech: $160-200k. Quant/HFT roles (highest): $300k-500k. After 3-5 years, mid-career compensation reaches $250-400k+ total.",
      },
      {
        q: "How can I pay for MS CS in USA from India?",
        a: "Typical funding mix: education loan ₹50-80 L (HDFC Credila 10.5%, SBI 8.5%, Prodigy 10.5% no-collateral), family contribution ₹15-25 L, on-campus RA/TA ₹15-30 L over 2 years. Loan EMI on ₹70 L at 11% for 7 years = ~₹1.2 L/month — affordable on $170k US salary. STEM OPT lets you work 3 years to pay off principal before H-1B uncertainty.",
      },
    ],
  },

  // MBA USA
  {
    slug: "mba-usa",
    course: "MBA",
    degree: "MBA",
    country: "USA",
    countrySlug: "usa",
    flag: "🇺🇸",
    metaTitle: "MBA in USA for Indian Students 2027: Top Schools, Fees, Salaries",
    metaDescription: "MBA in USA 2027 — Harvard, Stanford, Wharton, MIT Sloan top schools. Tuition ₹52-72 L/year. Median post-MBA salary ₹2.5 Cr. GMAT 720+ required. Complete guide for Indian students.",
    intro: "MBA in USA is the premier credential for Indian students aiming at consulting, finance, and entrepreneurship. Top US business schools place 90%+ of Indian graduates at McKinsey, BCG, Goldman, JP Morgan, FAANG — with median total compensation crossing $230,000 (~₹2 Cr+).",
    whyChoose: [
      "Top 7 globally ranked MBAs are all in USA (HBS, Stanford GSB, Wharton, MIT Sloan, Booth, Kellogg, Columbia)",
      "Median total compensation post-MBA: $230k+ (₹2-2.5 Cr)",
      "McKinsey, BCG, Bain hire 40+ Indians/year from top US MBAs",
      "STEM-designated MBAs (Sloan, Booth) get 3-year OPT",
      "Strong Indian alumni — Indra Nooyi, Ajay Banga, Sundar Pichai (briefly)",
      "Best for entrepreneurs: Stanford GSB pipeline → Silicon Valley VC",
    ],
    durationYears: "2 years (1-year options at Cornell, Kellogg available)",
    totalCostINR: "₹1.3 - 1.8 Cr (incl living)",
    tuitionAnnualINR: "₹62-72 L/year",
    intakeMonth: "Fall (August/September)",
    appDeadline: "Round 1: Sep 2026 · Round 2: Jan 2027 · Round 3: Apr 2027",
    englishRequired: "TOEFL 100+ / IELTS 7.5+",
    testsRequired: ["GMAT 720+ (M7 schools)", "GRE 325+ (alternative)", "TOEFL/IELTS"],
    topUniversities: [
      "Harvard Business School", "Stanford GSB", "Wharton (UPenn)",
      "MIT Sloan", "Columbia Business School", "Kellogg (Northwestern)",
      "Booth (Chicago)", "Tuck (Dartmouth)", "Yale SOM", "Haas (Berkeley)",
    ],
    topUniversitySlugs: ["harvard-university", "stanford-university"],
    popularJobs: [
      "Management Consultant — McKinsey/BCG/Bain (₹2-2.5 Cr)",
      "Investment Banking — Goldman/Morgan Stanley (₹2-3 Cr)",
      "Product Manager — FAANG (₹2-2.8 Cr)",
      "VC/PE Associate (₹2-3 Cr + carry)",
      "Founder / Operator at startup",
    ],
    startingSalaryINR: "₹2 - 2.5 Cr total compensation (base + bonus + signing)",
    postStudyVisa: "F-1 OPT (1 year) + STEM extension if STEM-designated (Sloan, Booth)",
    scholarshipsHint: "Need-based aid at HBS/Stanford/Wharton (up to 50%), Reliance Dhirubhai Fellowship at Stanford GSB, Tata Fellowship at MIT Sloan, Forte Foundation (women), military fellowships",
    faqs: [
      {
        q: "What is the average GMAT score for Indian students at top US MBA programs?",
        a: "Indian admits at top US MBAs typically have GMAT 730+ (Harvard/Stanford median ~740). Booth, Wharton, Kellogg: 720-735. Tuck, Yale, Haas: 715-730. Indian engineer demographic is the most competitive applicant pool — you need GMAT 740+ to be 'average'. Strong work experience + leadership impact can offset slightly lower GMAT (down to 700).",
      },
      {
        q: "How much does an MBA in USA cost for Indian students?",
        a: "Total cost: ₹1.3 - 1.8 Cr over 2 years. HBS: ₹95 L/year all-in. Stanford GSB: ₹98 L/year. Wharton: ₹92 L/year. Living + travel adds ₹15-22 L/year. Most Indian MBA students take education loans of ₹85 L - 1.5 Cr — covered comfortably by post-MBA $200k+ compensation.",
      },
      {
        q: "Is the MBA worth it for Indian students given the cost?",
        a: "Yes for most candidates with 4+ years of strong work experience. ROI analysis: ₹1.5 Cr cost, ₹2.2 Cr/year median post-MBA compensation, ~₹70 L/year savings post-tax. Payback period: 4-6 years on the loan. Career trajectory: 2x-3x acceleration vs staying in India. Best ROI: if you target consulting, finance, or tech PM roles.",
      },
      {
        q: "Should I do a US MBA at 1-year (Cornell/Kellogg) or traditional 2-year?",
        a: "1-year MBAs save ~₹70 L in tuition and 1 year of lost salary. But: smaller alumni network impact, fewer internship opportunities (key for career switchers), less time for self-discovery. 2-year is better if you're switching industries or geographies. 1-year better if you're returning to your existing field with a faster step up.",
      },
      {
        q: "Which is better — MBA from USA or UK for Indian students?",
        a: "USA: higher cost (₹1.5 Cr vs ₹78 L), longer (2 yrs vs 1 yr), higher salaries ($230k vs £85k), stronger global brand for consulting/finance/tech. UK: shorter, cheaper, 2-year post-study work visa, growing relevance for global careers. USA wins for absolute salary; UK wins for ROI. Roughly 60% of Indian MBA aspirants choose US, 40% UK.",
      },
    ],
  },

  // MS Data Science USA
  {
    slug: "ms-data-science-usa",
    course: "MS Data Science",
    degree: "Masters",
    country: "USA",
    countrySlug: "usa",
    flag: "🇺🇸",
    metaTitle: "MS Data Science in USA 2027: Fees, Top Universities, Jobs for Indians",
    metaDescription: "MS Data Science in USA for Indians 2027 — tuition ₹35-60 L/year, top schools (CMU, Berkeley, Columbia), 3-year STEM OPT, ₹1.2-1.6 Cr starting salaries.",
    intro: "MS Data Science is the 2nd most-applied STEM Masters by Indians in USA. With strong demand for ML engineers + data scientists across tech, finance, and healthcare — plus 3-year STEM OPT — this is one of the highest-ROI STEM programs in the US.",
    whyChoose: [
      "Strong demand: Glassdoor ranks Data Scientist #3 in highest-paying tech roles",
      "3-year STEM OPT (program is automatically STEM-designated)",
      "Median starting compensation: $160-200k (~₹1.4-1.7 Cr)",
      "Wide university choice — 60+ programs in top-50 schools",
      "Crossover into ML Engineering at FAANG is straightforward",
      "Lower competition than MS CS (smaller applicant pool)",
    ],
    durationYears: "1.5 - 2 years",
    totalCostINR: "₹65 L - 1.3 Cr",
    tuitionAnnualINR: "₹35-60 L/year",
    intakeMonth: "Fall (August)",
    appDeadline: "Mid-December 2026 (varies by school)",
    englishRequired: "TOEFL 100+ / IELTS 7.0+",
    testsRequired: ["GRE 320+ (some optional)", "TOEFL/IELTS"],
    topUniversities: [
      "Carnegie Mellon University", "UC Berkeley", "Columbia",
      "Stanford", "USC", "University of Michigan", "NYU",
      "Georgia Tech", "UCLA", "Northwestern",
    ],
    topUniversitySlugs: ["stanford-university"],
    popularJobs: [
      "Data Scientist (₹1.3-1.7 Cr)",
      "Machine Learning Engineer (₹1.5-2 Cr)",
      "AI Research Engineer (₹1.8-2.5 Cr)",
      "Quantitative Analyst at hedge funds (₹2-3 Cr)",
      "Applied Scientist at FAANG (₹1.8-2.5 Cr)",
    ],
    startingSalaryINR: "₹1.3 - 1.7 Cr base + bonus + equity",
    postStudyVisa: "F-1 OPT (1 year) + STEM extension (24 months) = 3 years",
    scholarshipsHint: "University-specific RA/TA roles (cover 30-100% tuition + stipend), Tata Fellowship, Inlaks, Foundation for Excellence (FFE) for top-rank Indian students",
    faqs: [
      {
        q: "How much does MS Data Science in USA cost for Indians?",
        a: "Total: ₹65 L - 1.3 Cr. Top schools (Berkeley, Stanford, CMU, Columbia): ₹50-65 L/year tuition. Mid-tier: ₹35-50 L/year. Living: ₹15-22 L/year depending on city. A 1.5-year program ends up around ₹80-95 L total; 2-year MSDS at top schools can hit ₹1.2 Cr+.",
      },
      {
        q: "Is MS Data Science worth it vs MS Computer Science?",
        a: "MSDS specializes in analytics + ML, while MS CS is broader. For pure ML/AI careers — both work. MSDS often has more applied curriculum (less theory, more projects). MS CS has broader career flexibility (systems, security, web, ML). Salary: similar starting (~$170k). MSDS easier to get admitted (smaller applicant pool), often shorter (1-1.5 yr).",
      },
      {
        q: "Which is the best US university for MS Data Science?",
        a: "CMU (best for ML), Berkeley (strong stats + ML), Stanford (data science institute), Columbia (NYC + finance pipeline), USC (good ROI, large Indian community). For most ROI: UT Austin DSC, Penn State, NCSU, Northeastern — all strong programs at half the cost of top schools.",
      },
      {
        q: "What is the placement rate for MS Data Science in USA?",
        a: "Top schools: 95%+ within 6 months. Median: 12 weeks to first offer post-graduation. Top employers: Meta, Amazon, Google, Microsoft, Apple, Stripe, Airbnb, Netflix, Capital One, JPMorgan, Goldman Sachs. Bay Area + NYC remain top placement hubs.",
      },
    ],
  },

  // MBA UK
  {
    slug: "mba-uk",
    course: "MBA",
    degree: "MBA",
    country: "UK",
    countrySlug: "uk",
    flag: "🇬🇧",
    metaTitle: "MBA in UK for Indian Students 2027: Top Schools, 1-Year Programs, Costs",
    metaDescription: "MBA in UK 2027 for Indians — LBS, Said Oxford, Judge Cambridge, Manchester. 1-year programs ₹55-92 L total. 2-year Graduate Route visa. Complete guide.",
    intro: "UK MBA is the smartest ROI choice for Indian managers — 1-year programs at LBS, Said Oxford, Judge Cambridge save ~₹70 L vs equivalent US MBAs, plus the 2-year Graduate Route visa lets you work in UK post-MBA. Top UK MBAs place graduates at McKinsey, BCG, Goldman, Big Tech UK.",
    whyChoose: [
      "1-year programs = ₹70 L cheaper than 2-year US MBAs",
      "2-year Graduate Route post-study work visa (no employer sponsorship needed first 2 years)",
      "London Business School (LBS) ranked Top 5 globally",
      "Said Oxford + Judge Cambridge offer Oxbridge brand value",
      "Stronger global career mobility — UK MBA recognized in Europe, Asia, Middle East",
      "Sub-30 Indian students per top-school MBA cohort — tighter network",
    ],
    durationYears: "1 year (some 12-15 months)",
    totalCostINR: "₹65 L - 1 Cr (incl living)",
    tuitionAnnualINR: "₹55-78 L (one-time, 1-year)",
    intakeMonth: "September - October",
    appDeadline: "Stage 1: Sep 2026 · Stage 4 (final): Mar/Apr 2027",
    englishRequired: "IELTS 7.0+ / TOEFL 100+",
    testsRequired: ["GMAT 700+ (LBS prefers 720+)", "IELTS / TOEFL"],
    topUniversities: [
      "London Business School (LBS)", "Said Oxford", "Judge Cambridge",
      "Imperial College London", "Manchester Business School",
      "Warwick Business School", "Cranfield", "Cass (City)",
      "Edinburgh", "Lancaster",
    ],
    topUniversitySlugs: ["university-of-oxford", "university-of-cambridge"],
    popularJobs: [
      "Management Consultant — McKinsey/BCG/Bain London (£80-110k)",
      "Investment Banking — Goldman/JPM London (£90-130k + bonus)",
      "Product Manager — Google UK/Meta London (£100-130k)",
      "VC/PE Associate London (£90-120k + carry)",
      "Returning to India: COO/CXO roles at startups",
    ],
    startingSalaryINR: "₹85 L - 1.4 Cr (£85-130k base + bonus)",
    postStudyVisa: "2-year Graduate Route visa (3 years for PhD)",
    scholarshipsHint: "Rhodes Scholarship at Oxford (5 Indians/year), Skoll Scholarship at Said (entrepreneurship), Inlaks Foundation, Felix Scholarship at Oxford, Cambridge Trust",
    faqs: [
      {
        q: "How much does an MBA in UK cost for Indian students?",
        a: "Total: ₹65 L - 1 Cr for 1-year programs. Said Oxford MBA: ~₹98 L total. Judge Cambridge: ~₹92 L. LBS (2-year sometimes): ₹1.2 Cr. Living in London adds ₹20 L/year vs ₹12 L in Oxford/Cambridge. UK MBA is roughly HALF the cost of an equivalent US MBA at top schools.",
      },
      {
        q: "Is a 1-year UK MBA worth it vs 2-year US MBA?",
        a: "Depends on your goal. Career boost in India/Asia/Middle East — 1-year UK is better ROI. US tech/finance career — 2-year US is better for visa runway + alumni density. Cost-benefit: UK MBA pays back in 3-4 years; US MBA in 5-7 years (due to higher cost but higher salary).",
      },
      {
        q: "Which UK MBA is best for Indian students?",
        a: "LBS (London Business School) wins on global brand + London ecosystem. Said Oxford wins on Oxbridge prestige + 1-year intensive. Judge Cambridge similar to Said. Manchester offers excellent value + strong Asia connections. Best for entrepreneurs: Imperial Business School (London tech ecosystem).",
      },
      {
        q: "What jobs do Indians get after UK MBA?",
        a: "Consulting (McKinsey, BCG, Bain, Big 4) — ~30% of placements. Investment Banking (Goldman, JPM, Morgan Stanley) — ~20%. Tech (Google, Meta, Amazon) — ~25%. Industry (Unilever, GSK, Shell) — ~10%. Returning to India for senior roles at startups/MNCs — ~15%. London salaries: £85-130k base. India return at COO/VP level: ₹80 L - 1.5 Cr.",
      },
    ],
  },

  // MS Computer Science UK
  {
    slug: "ms-computer-science-uk",
    course: "MSc Computer Science",
    degree: "Masters",
    country: "UK",
    countrySlug: "uk",
    flag: "🇬🇧",
    metaTitle: "MSc Computer Science in UK 2027: Top Universities, Fees, Jobs for Indians",
    metaDescription: "MSc Computer Science in UK for Indian students 2027 — Oxford, Cambridge, Imperial, UCL. 1-year programs ₹40-58 L. Graduate Route visa 2 years.",
    intro: "MSc Computer Science in UK is the smart choice for Indian engineers who want a top-brand CS Masters without the 2-year USA commitment. Imperial College London, Oxford, Cambridge, UCL — all 1-year programs ranking globally — at half the USA cost.",
    whyChoose: [
      "1-year program saves ₹35-50 L vs USA equivalent",
      "Imperial CS ranked #6 globally; Oxford + Cambridge top-10",
      "2-year Graduate Route visa for UK work search",
      "London tech ecosystem (Google, Meta, DeepMind, Stripe, Revolut)",
      "Strong AI research (DeepMind, OpenAI presence)",
      "Easier admission than US top schools for similar caliber",
    ],
    durationYears: "1 year",
    totalCostINR: "₹50 - 75 L (incl living)",
    tuitionAnnualINR: "₹40-58 L (one-time)",
    intakeMonth: "October",
    appDeadline: "December 2026 - March 2027 (rolling for many)",
    englishRequired: "IELTS 7.0+ / TOEFL 100+",
    testsRequired: ["IELTS / TOEFL", "GRE often NOT required (UK CS programs)"],
    topUniversities: [
      "Imperial College London", "University of Oxford", "University of Cambridge",
      "UCL", "Edinburgh", "King's College London", "Manchester",
      "Bristol", "Warwick", "Southampton",
    ],
    topUniversitySlugs: ["university-of-oxford", "university-of-cambridge"],
    popularJobs: [
      "Software Engineer London (£70-95k)",
      "ML Engineer at DeepMind/Stripe (£90-130k)",
      "Quant Developer at HFT firms (£95k-200k)",
      "Data Engineer Big 4 Tech (£75-100k)",
      "Returning to India: Senior Engineer roles (₹40-80 L/year)",
    ],
    startingSalaryINR: "₹75 L - 1.1 Cr (£70-95k base)",
    postStudyVisa: "2-year Graduate Route visa",
    scholarshipsHint: "Clarendon at Oxford (200+ awards), Gates Cambridge, Chevening, Felix at Oxford, Inlaks, Commonwealth Scholarship",
    faqs: [
      {
        q: "Is MSc Computer Science in UK worth it for Indian students?",
        a: "Yes if you want speed + cost-efficiency. 1-year MSc at Imperial/UCL costs ₹50-65 L total vs ₹1+ Cr for 2-year USA. Graduate Route visa lets you work in London 2 years (median tech salary £85k = ₹90 L). Total cost-of-MS + 2-year UK earnings → typically positive within 2 years post-graduation. Best for engineers focused on Europe career.",
      },
      {
        q: "Which is better — MS CS in UK or USA?",
        a: "USA: longer (2yr), more expensive, higher salaries ($170k vs £85k), 3-year STEM OPT, FAANG access. UK: shorter (1yr), cheaper, 2-year work visa, lower salaries but lower cost of living. ROI similar over 5-year horizon. UK better if you want fast turnaround + Europe career. USA better for max long-term salary in US tech.",
      },
      {
        q: "Do UK universities require GRE for MSc Computer Science?",
        a: "Most UK universities do NOT require GRE for MSc CS — including Imperial, UCL, Edinburgh, Manchester. Oxford + Cambridge MSc programs also typically don't require GRE. They focus on undergrad CGPA (8.0+/10), IELTS 7.0+, statement of purpose, and 2-3 academic references. This is a major plus for Indian students who skip GRE preparation.",
      },
      {
        q: "What scholarships are available for MSc CS in UK?",
        a: "Top options: Clarendon Scholarship at Oxford (200+/year, fully funded); Gates Cambridge (~80/year, fully funded); Chevening (UK government, ~70 Indians/year, fully funded); Commonwealth (~30 Indians/year); Inlaks Foundation (partial up to ₹1 Cr); Felix Scholarship at Oxford (15 Indians/year, fully funded). Apply 12-15 months ahead.",
      },
    ],
  },

  // MS Canada
  {
    slug: "ms-computer-science-canada",
    course: "MS Computer Science",
    degree: "Masters",
    country: "Canada",
    countrySlug: "canada",
    flag: "🇨🇦",
    metaTitle: "MS Computer Science in Canada 2027: Top Universities, Fees, PR Pathway",
    metaDescription: "MS Computer Science in Canada 2027 for Indians — UofT, UBC, McGill, Waterloo. Tuition ₹15-30 L/year. Clear PR pathway via Express Entry. Complete guide.",
    intro: "MS CS in Canada is the budget-friendly + immigration-friendly choice for Indian engineers. Tuition is ₹15-30 L/year (50% cheaper than USA) and the PR pathway via Express Entry post-PGWP is the most predictable among major destinations.",
    whyChoose: [
      "Tuition 50% cheaper than USA equivalent programs",
      "Clearest PR pathway — most CS grads get PR within 2-3 years post-graduation",
      "Post-Graduation Work Permit (PGWP) up to 3 years",
      "Top universities in QS — UofT (#21), UBC (#34), McGill (#27)",
      "Strong tech ecosystem — Shopify, Wattpad, BlackBerry, Toronto AI cluster",
      "320,000+ Indian students = massive support network",
    ],
    durationYears: "1.5 - 2 years",
    totalCostINR: "₹35 - 60 L",
    tuitionAnnualINR: "₹15-30 L/year",
    intakeMonth: "Fall (September) — primary; Winter (January) limited",
    appDeadline: "December 2026 - February 2027",
    englishRequired: "IELTS 6.5+ / TOEFL 86+",
    testsRequired: ["IELTS 6.5+", "GRE optional at most schools"],
    topUniversities: [
      "University of Toronto", "UBC", "McGill",
      "University of Waterloo", "University of Alberta",
      "McMaster", "Queen's", "Western", "Simon Fraser", "Calgary",
    ],
    topUniversitySlugs: [],
    popularJobs: [
      "Software Engineer Toronto/Vancouver (₹65-90 L)",
      "ML Engineer (₹75-1.1 Cr)",
      "Data Engineer (₹60-85 L)",
      "Backend Engineer (₹65-95 L)",
      "Returning to India: 60-90% salary hike on existing role",
    ],
    startingSalaryINR: "₹60-95 L (CAD 95-130k)",
    postStudyVisa: "PGWP up to 3 years + Express Entry PR pathway",
    scholarshipsHint: "Vanier Canada Graduate Scholarship (PhD), University of Toronto scholarships, McCall MacBain at McGill, OGS in Ontario, Inlaks Foundation",
    faqs: [
      {
        q: "How much does MS CS in Canada cost for Indian students?",
        a: "Total: ₹35-60 L for 2 years. Tuition: ₹15-30 L/year — UofT + UBC + McGill at higher end (~₹28 L/year); Waterloo, Alberta, McMaster mid-tier (₹18-22 L/year). Living: ₹10-15 L/year (Toronto + Vancouver expensive, Edmonton + Winnipeg cheap). 2-year program total: ~₹50-65 L. 50% cheaper than USA equivalent at similar ranking.",
      },
      {
        q: "Is MS CS in Canada worth it vs USA for Indian students?",
        a: "Canada wins on: cost (half), clearer PR pathway, friendlier visa, family-friendly. USA wins on: salaries (1.6x higher in USD), top universities, FAANG access, broader career options. Best for: students prioritizing PR + lower-stress immigration over absolute salary. Most Indian MS CS Canada grads earn ₹70-90 L (CAD 100-120k), settle in Toronto/Vancouver, get PR within 3 years.",
      },
      {
        q: "Which is the best Canadian university for MS Computer Science?",
        a: "UofT (top brand + Toronto AI cluster), UBC (Vancouver + west coast tech), Waterloo (co-op + tech industry connections — Google Waterloo, BlackBerry), McGill (research strong + Montreal). For pure ML/AI: UofT (Geoffrey Hinton's institution), Mila (Montreal — Yoshua Bengio). For PR ease: Alberta, Manitoba universities give regional PR bonus.",
      },
      {
        q: "Can I get PR after MS CS in Canada?",
        a: "Yes — Canada is the clearest PR pathway. After 2-year MS, you get 3-year Post-Graduation Work Permit (PGWP). Work 1 year as Software Engineer → apply Express Entry with Canadian Experience Class points. Most CS grads have 470+ CRS score (cutoff ~480) → PR within 12-24 months. About 80-85% of Indian MS CS grads in Canada get PR within 3 years post-graduation.",
      },
    ],
  },

  // MS Mechanical Engineering Germany
  {
    slug: "ms-mechanical-engineering-germany",
    course: "MS Mechanical Engineering",
    degree: "Masters",
    country: "Germany",
    countrySlug: "germany",
    flag: "🇩🇪",
    metaTitle: "MS Mechanical Engineering in Germany 2027: FREE Tuition Guide for Indians",
    metaDescription: "MS Mechanical Engineering in Germany 2027 — FREE tuition at TUM, RWTH Aachen, KIT. Total cost ₹12-15 L/year. EU Blue Card to PR in 21-33 months. Indian engineer's dream.",
    intro: "MS Mechanical Engineering in Germany at public universities is FREE tuition — only €150-350/semester contribution. With TUM, RWTH Aachen, KIT among the world's top engineering schools, and the EU Blue Card → PR pathway, this is the highest-ROI Masters for Indian mechanical engineers.",
    whyChoose: [
      "ZERO tuition at public universities (just €300/semester contribution = ₹26k)",
      "Total cost: ₹12-15 L/year (vs ₹65-95 L in USA)",
      "TUM, RWTH Aachen, KIT all in QS top 100 globally",
      "18-month post-study Jobseeker Visa",
      "EU Blue Card → Permanent Residence in 21-33 months",
      "Direct path to Bosch, BMW, Siemens, Daimler, Mercedes engineering jobs",
    ],
    durationYears: "2 years",
    totalCostINR: "₹20 - 30 L (just living + admin)",
    tuitionAnnualINR: "₹0 (€300/semester contribution)",
    intakeMonth: "Winter (October) — primary; Summer (April) some programs",
    appDeadline: "Mid-July 2026 for Winter 2027 intake",
    englishRequired: "IELTS 6.5+ / TOEFL 90+ for English programs; A2 German for some",
    testsRequired: ["IELTS / TOEFL for English programs", "GRE NOT required"],
    topUniversities: [
      "Technical University of Munich (TUM)", "RWTH Aachen University",
      "Karlsruhe Institute of Technology (KIT)", "TU Berlin",
      "University of Stuttgart", "TU Darmstadt", "TU Dresden",
      "Leibniz Hannover", "RPTU Kaiserslautern", "FAU Erlangen-Nuremberg",
    ],
    topUniversitySlugs: [],
    popularJobs: [
      "Mechanical Design Engineer at BMW/Mercedes (€55-70k)",
      "Process Engineer at Bosch/Siemens (€50-65k)",
      "Automotive R&D at Audi/Porsche (€60-75k)",
      "Energy Systems Engineer at Siemens Energy (€55-70k)",
      "Returning to India: senior R&D roles (₹25-40 L/year)",
    ],
    startingSalaryINR: "₹50-65 L (€55-70k)",
    postStudyVisa: "18-month Jobseeker Visa + EU Blue Card → PR (21-33 months)",
    scholarshipsHint: "DAAD Scholarship (most popular, ₹95 L/year), Deutschlandstipendium (€300/month), Friedrich Ebert Stiftung, Heinrich Böll Foundation, Inlaks Foundation",
    faqs: [
      {
        q: "Is MS in Germany really free for Indian students?",
        a: "Yes at public universities — TUM, RWTH Aachen, KIT, TU Berlin, etc. charge ZERO tuition. You only pay a small semester contribution of €150-350 (~₹13,000-30,000) which covers student services + semester public transport ticket. Exception: Baden-Württemberg state (KIT, Stuttgart, Heidelberg) charges €1,500/semester for non-EU students. Private universities (SRH, Jacobs) charge €15-25k/year — but rare and not recommended.",
      },
      {
        q: "How much do Indian students spend in total studying ME in Germany?",
        a: "Total cost: ₹20-30 L over 2 years (mostly living, no tuition). Monthly living: €900-1100 (~₹80,000-99,000). Blocked Account required for visa: €11,904 deposit (~₹10.6 L, yours after arrival). Working part-time (120 days/year): earn ₹5-8 L. Net total cost out-of-pocket: ₹15-20 L over 2 years. Roughly 1/10th the cost of equivalent US MS.",
      },
      {
        q: "Do I need to know German for MS Mechanical Engineering in Germany?",
        a: "Not for English-taught programs — 200+ English Master's available in Engineering. TUM, RWTH, KIT all offer English MS programs. BUT knowing basic German (A1-A2) helps massively for: part-time jobs, daily life, post-study job market. Most engineering jobs in Germany expect B1-B2 German (we recommend learning ~A2 before arrival, B1 during MS).",
      },
      {
        q: "Can I work in Germany after MS Mechanical Engineering?",
        a: "Yes. 18-month Jobseeker Visa post-graduation, then EU Blue Card once employed at €58,400+ salary (€43,800+ for STEM). EU Blue Card → Permanent Residence in 21-33 months with B1 German. German citizenship in 8 years (6 with B2 German + integration). Indian mechanical engineers have one of the strongest pipelines to German auto + manufacturing jobs.",
      },
      {
        q: "Which is the best German university for MS Mechanical Engineering?",
        a: "TUM (#37 globally, #1 for engineering in Germany) — most Indian alumni at BMW/Siemens. RWTH Aachen (#106) — research-heavy, strong industry partnerships, closest to German auto OEMs. KIT (#119) — Baden-Württemberg charges fees but excellent placement. TU Berlin — top for renewable energy + sustainability. TU Darmstadt — Frankfurt area auto industry connections.",
      },
    ],
  },

  // MBA Singapore
  {
    slug: "mba-singapore",
    course: "MBA",
    degree: "MBA",
    country: "Singapore",
    countrySlug: "singapore",
    flag: "🇸🇬",
    metaTitle: "MBA in Singapore 2027 for Indian Students: NUS, NTU, INSEAD, Costs",
    metaDescription: "MBA in Singapore 2027 — NUS, NTU, INSEAD top programs. Tuition ₹40-65 L. Tuition Grant covers 50%. 3-hr flight to India. 1-year jobseeker visa.",
    intro: "MBA in Singapore is the most ROI-friendly Asian MBA for Indian managers — close to home (3-hour flight), low culture shock, world-class brand (NUS + INSEAD Asia + NTU), and the unique Tuition Grant Scheme that cuts tuition by 50% in exchange for 3-year work bond in Singapore.",
    whyChoose: [
      "Tuition Grant cuts cost by 50%+ (3-year Singapore work bond)",
      "NUS Asia, INSEAD Asia, NTU all top-30 globally",
      "Singapore tech ecosystem — Google APAC HQ, Meta APAC, Stripe, ByteDance",
      "3-hour direct flight to most Indian metros",
      "English official language, lots of Indian food + diaspora (9% of population)",
      "PR pathway via Employment Pass → PR within 5-7 years",
    ],
    durationYears: "1 year (NUS), 10 months (INSEAD)",
    totalCostINR: "₹50-90 L (after Tuition Grant)",
    tuitionAnnualINR: "₹40-65 L (1-time, with Grant)",
    intakeMonth: "August (NUS), August/January (INSEAD)",
    appDeadline: "Rolling Sep 2026 - May 2027",
    englishRequired: "IELTS 7.0+ / TOEFL 100+ / Verbal GMAT 35+",
    testsRequired: ["GMAT 680+ (NUS) / 710+ (INSEAD)", "IELTS / TOEFL"],
    topUniversities: [
      "NUS (National University of Singapore)", "INSEAD Asia (Singapore campus)",
      "NTU (Nanyang Technological University)", "SMU (Singapore Management University)",
      "ESSEC Asia-Pacific (Singapore campus)",
    ],
    topUniversitySlugs: [],
    popularJobs: [
      "Management Consultant — McKinsey/BCG Singapore (₹70-95 L)",
      "Banking — Citi/Standard Chartered (₹65-85 L)",
      "Tech PM — Google/Meta APAC (₹85-1.1 Cr)",
      "Strategy at Sea/Grab/Shopee (₹70-95 L)",
      "Returning to India: COO/VP at startups (₹60-1 Cr)",
    ],
    startingSalaryINR: "₹70-95 L (SGD 100k-130k base)",
    postStudyVisa: "1-year Visit Pass post-MBA; Employment Pass (SGD 5k+ salary) → PR pathway",
    scholarshipsHint: "Tuition Grant Scheme (automatic 50% reduction, 3-year work bond), Lee Kuan Yew Scholarship at NUS, INSEAD MBA Scholarship for Asian women, GMAC Asia Scholarship, J.N. Tata Endowment",
    faqs: [
      {
        q: "How much does MBA in Singapore cost for Indian students?",
        a: "Total: ₹50-90 L. NUS MBA with Tuition Grant: ~₹65 L total (tuition + living). INSEAD Asia: ₹85-95 L (higher tuition, no Tuition Grant). NTU MBA: ₹55-70 L (cheaper option). All include Singapore-level living (₹15-20 L/year, but most students do internship that covers ₹8-10 L of that). Roughly 60% cheaper than US MBA, 30% cheaper than UK MBA.",
      },
      {
        q: "What is the Tuition Grant for Indian MBA students in Singapore?",
        a: "Government subsidy reducing tuition by 50%+ at NUS, NTU (not INSEAD). In exchange, you must work in Singapore for 3 years post-graduation (with any registered Singapore company). Saves ₹20-25 L total. Almost all Indian students take it — Singapore salaries (SGD 5-8k/month) are excellent + work bond is easy to fulfill. Doubles as PR pathway.",
      },
      {
        q: "Is Singapore MBA worth it vs USA or UK?",
        a: "For Asia-Pacific career: yes, best ROI. INSEAD/NUS MBAs place graduates at McKinsey Singapore, Google APAC, Sea, Grab. Cheaper than USA, faster than US 2-year. Better network for India return. WORSE for: US-focused careers (limited US recruiting), pure tech focus (USA wins). Best fit for Indian managers who want APAC career or India return.",
      },
      {
        q: "Can I get PR in Singapore after MBA?",
        a: "Yes. After Tuition Grant work bond (3 years), you have Employment Pass — start PR application. Typical timeline: 1-2 years after EP to receive PR. PR opens up CPF (retirement savings), housing benefits, family sponsorship. 5-7 years total from MBA start to PR. Singapore citizenship: 2 more years after PR. ~70% of Indian Singapore MBA grads stay long-term.",
      },
    ],
  },

  // Postgraduate Diploma Canada (the "PG Diploma" pathway)
  {
    slug: "postgraduate-diploma-canada",
    course: "Postgraduate Diploma",
    degree: "PG Diploma",
    country: "Canada",
    countrySlug: "canada",
    flag: "🇨🇦",
    metaTitle: "Postgraduate Diploma in Canada 2027: PR Pathway for Indian Students",
    metaDescription: "PG Diploma in Canada 2027 for Indian students — Seneca, Centennial, Humber, Conestoga. ₹15-25 L total, 1-2 years, PGWP eligible, fastest PR route.",
    intro: "Postgraduate Diplomas at Canadian community colleges are the budget-friendly + PR-friendly route for Indian students who can't afford Master's tuition or want faster job market entry. ₹15-25 L total, 1-2 years, PGWP eligible (2-3 years), and clearer PR pathway than many degree programs.",
    whyChoose: [
      "Total cost just ₹15-25 L (vs ₹40+ L for university Masters)",
      "1-2 year programs — faster job market entry",
      "PGWP eligibility same as Masters (1-3 years depending on program length)",
      "Express Entry PR pathway works — Canadian Experience Class points",
      "Strong industry partnerships — colleges focus on employable skills",
      "Easier admission (60-65% in undergrad sufficient at most colleges)",
    ],
    durationYears: "1-2 years (2+ year programs give 3-year PGWP)",
    totalCostINR: "₹15 - 25 L",
    tuitionAnnualINR: "₹10-15 L/year",
    intakeMonth: "Fall (Sep), Winter (Jan), Summer (May)",
    appDeadline: "8-12 months before intake",
    englishRequired: "IELTS 6.0+ (6.5 for SDS)",
    testsRequired: ["IELTS 6.0+", "GRE/GMAT NOT required"],
    topUniversities: [
      "Seneca College (Toronto)", "Centennial College (Toronto)",
      "Humber College (Toronto)", "George Brown College (Toronto)",
      "Sheridan College (Oakville)", "Conestoga College (Kitchener)",
      "Algonquin College (Ottawa)", "Fanshawe (London ON)",
      "BCIT (Vancouver)", "SAIT (Calgary)",
    ],
    topUniversitySlugs: [],
    popularJobs: [
      "Software Developer (₹50-70 L)",
      "Project Coordinator (₹45-60 L)",
      "Business Analyst (₹50-65 L)",
      "Logistics & Supply Chain (₹45-60 L)",
      "Hospitality Management (₹40-55 L)",
    ],
    startingSalaryINR: "₹40-65 L (CAD 60-95k)",
    postStudyVisa: "PGWP up to 3 years (for 2+ year programs)",
    scholarshipsHint: "Most colleges offer entrance scholarships ₹50k-2 L for high IELTS + grades. Provincial bursaries available. Inlaks doesn't cover colleges; J.N. Tata Endowment loan available.",
    faqs: [
      {
        q: "Is PG Diploma in Canada worth it vs Master's?",
        a: "For most Indian students seeking PR + job market entry — YES. PG Diploma: ₹15-25 L total, 1-2 years, ₹50-65 L starting salary, PR within 3-4 years. Master's: ₹40-60 L total, 2 years, ₹65-95 L salary, PR similar timeline. ROI-wise, PG Diploma wins for cost-conscious students. Master's wins for academic/research careers + slight salary edge.",
      },
      {
        q: "Which is the best PG Diploma college in Canada for Indians?",
        a: "Seneca (largest Indian student base, 4 Toronto campuses), Centennial (strong industry placement), Humber (good IT/business programs), Conestoga (Kitchener-Waterloo tech corridor), Sheridan (animation + design specialty), George Brown (downtown Toronto + hospitality). For Vancouver: BCIT. For Calgary: SAIT. Pick based on program + location + your post-grad city plans.",
      },
      {
        q: "Do PG Diplomas qualify for Canadian Post-Graduation Work Permit?",
        a: "Yes — at PUBLIC Designated Learning Institutions (DLIs). Most well-known colleges (Seneca, Humber, Centennial, etc.) are DLIs. Confirm before applying. PGWP duration: 1-year program → 1 year PGWP; 2-year program → 3 year PGWP. Two-year is the sweet spot — same effort as MS, half the cost, max PGWP.",
      },
      {
        q: "Can I get PR after PG Diploma in Canada?",
        a: "Yes — same Express Entry pathway as Masters. Get PGWP (1-3 years) → work 1 year in skilled role (NOC TEER 0/1/2/3) → apply Express Entry. CRS scoring slightly lower than Masters holders (no degree-level bonus) but achievable with strong English (CLB 9+ = IELTS 8.0). Provincial Nominee Programs (Manitoba, Saskatchewan, Atlantic provinces) actively nominate PG Diploma graduates — fastest PR route.",
      },
    ],
  },

  // Master of IT Australia
  {
    slug: "master-of-it-australia",
    course: "Master of Information Technology",
    degree: "Masters",
    country: "Australia",
    countrySlug: "australia",
    flag: "🇦🇺",
    metaTitle: "Master of IT in Australia 2027 for Indian Students: Top Universities, PR Pathway",
    metaDescription: "Master of IT in Australia 2027 for Indians — Melbourne, Sydney, ANU, Monash. ₹35-50 L/year. 2-4 year Subclass 485 visa. PR via SkillSelect.",
    intro: "Master of IT (or Master of Information Systems) in Australia is one of the most-applied programs by Indian engineers, combining strong university brands (7 in QS top 50), the 2-4 year Subclass 485 post-study work visa, and a clear PR pathway via SkillSelect skilled migration.",
    whyChoose: [
      "7 Australian universities in QS top 50 globally",
      "Subclass 485 post-study work visa: 2-4 years depending on degree",
      "Regional study bonus: extra 1-2 years post-study work (Adelaide, Brisbane)",
      "Strong demand for IT skills — IT is on Australia's skilled migration list",
      "Higher hourly wages while studying than UK/Canada (AUD 25-35/hour)",
      "Career trajectory to ₹95L-1.2 Cr at senior level + clear PR pathway",
    ],
    durationYears: "2 years",
    totalCostINR: "₹55-85 L",
    tuitionAnnualINR: "₹22-32 L/year",
    intakeMonth: "Semester 1 (February), Semester 2 (July)",
    appDeadline: "Oct 2026 (Sem 1, 2027) · May 2027 (Sem 2, 2027)",
    englishRequired: "IELTS 6.5+ / TOEFL 79+ / PTE 58+",
    testsRequired: ["IELTS / TOEFL / PTE", "GRE NOT required"],
    topUniversities: [
      "University of Melbourne", "University of Sydney",
      "Australian National University (ANU)", "UNSW (University of New South Wales)",
      "Monash University", "University of Queensland",
      "RMIT University", "UTS (University of Technology Sydney)",
      "Adelaide University", "Macquarie University",
    ],
    topUniversitySlugs: [],
    popularJobs: [
      "Software Engineer (₹65-90 L, AUD 95-130k)",
      "Cloud Engineer at AWS/Atlassian (₹85-1.1 Cr)",
      "Data Engineer at Canva/Atlassian (₹75-95 L)",
      "Cybersecurity Analyst (₹70-95 L)",
      "Returning to India: Tech Lead/Architect (₹35-60 L)",
    ],
    startingSalaryINR: "₹65-95 L (AUD 95-135k)",
    postStudyVisa: "Subclass 485 (2 years Bachelor/Master, 3 years Master by Research, 4 years PhD; +1-2 years regional)",
    scholarshipsHint: "Australia Awards Scholarship (limited Indian seats), University-specific scholarships (Melbourne International, Sydney Scholars, ANU Tuition), Endeavour Scholarship (replaced by Australia Awards), Inlaks Foundation",
    faqs: [
      {
        q: "How much does Master of IT cost in Australia for Indian students?",
        a: "Total: ₹55-85 L over 2 years. Top universities (Melbourne, Sydney, ANU): tuition AUD 47-55k/year (~₹26-32 L). Mid-tier (Monash, RMIT, UTS): AUD 40-46k/year (₹22-26 L). Living: AUD 21-30k/year (₹12-17 L) — Sydney + Melbourne expensive, Adelaide + Perth cheaper. Part-time work (48 hrs/fortnight at AUD 25-35/hour) earns ₹6-10 L during studies.",
      },
      {
        q: "Can I get PR in Australia after Master of IT?",
        a: "Yes, via SkillSelect skilled migration. After Master + 2-year Subclass 485, accumulate points (age, English, work experience, qualification). Most Indian IT grads with 1-2 years Australia work hit 75-85 points (cutoff fluctuates ~65-75). Apply Subclass 189 (independent) or 190 (state-sponsored). State sponsorship from Tasmania, Northern Territory accelerates PR. Typical timeline: 2-3 years post-graduation.",
      },
      {
        q: "Which is better — Master of IT in Australia or Canada?",
        a: "Both excellent for Indian engineers. Australia: better universities (7 in QS top 50 vs Canada's 3), higher salaries (AUD 95-135k vs CAD 90-125k), better weather, more challenging PR. Canada: clearer PR pathway, cheaper, larger Indian community, more lenient visa policies. ROI similar at ~₹85-95 L starting + PR within 3 years.",
      },
      {
        q: "Which Australian university is best for Master of IT?",
        a: "Top tier: Melbourne (#13), Sydney (#19), ANU (#22), UNSW (#19) — all in QS top 25. Best ROI: Monash, UTS, RMIT (lower tuition, strong tech ecosystem). For Indian community + cheaper living: Macquarie, Adelaide. For best post-MS job market: Sydney + Melbourne (concentrated tech employers — Atlassian, Canva, Amazon AWS, Google, Microsoft).",
      },
    ],
  },

  // MSc Finance UK
  {
    slug: "msc-finance-uk",
    course: "MSc Finance",
    degree: "Masters",
    country: "UK",
    countrySlug: "uk",
    flag: "🇬🇧",
    metaTitle: "MSc Finance in UK 2027: LSE, LBS, Oxford, Imperial for Indian Students",
    metaDescription: "MSc Finance in UK 2027 for Indians — LSE, LBS, Oxford Said, Imperial. Tuition ₹35-55 L. 1-year programs. London finance roles ₹95L-1.5 Cr.",
    intro: "MSc Finance in UK is the gold standard for Indian aspirants to investment banking, hedge funds, and asset management. LSE, London Business School, Oxford Said, and Imperial Business School place graduates at Goldman Sachs, JP Morgan, Morgan Stanley, BlackRock with starting compensation of ₹95L-1.5 Cr.",
    whyChoose: [
      "London is the world's #1 finance hub (rivals NYC for jobs)",
      "1-year programs save ₹40-60 L vs USA MS Finance",
      "LSE Finance ranks consistently #1-3 globally for MSc Finance",
      "Direct pipeline to City of London IB roles — Goldman, JPM, Morgan Stanley",
      "2-year Graduate Route visa = 2 years of London IB experience",
      "Strong alumni network — many Indians in top London + Wall Street roles",
    ],
    durationYears: "1 year (12 months including summer project)",
    totalCostINR: "₹52-75 L (incl living)",
    tuitionAnnualINR: "₹35-55 L (one-time)",
    intakeMonth: "September",
    appDeadline: "Round 1: Oct 2026 · Round 4: Apr 2027",
    englishRequired: "IELTS 7.0+ / TOEFL 100+",
    testsRequired: ["GMAT 700+ (LSE/LBS prefer 720+)", "GRE alternative", "IELTS/TOEFL"],
    topUniversities: [
      "London School of Economics (LSE)", "London Business School (LBS)",
      "Oxford Said Business School", "Imperial College Business School",
      "Warwick Business School", "UCL School of Management",
      "Cass Business School (City)", "Cambridge Judge",
      "Manchester Business School", "Edinburgh Business School",
    ],
    topUniversitySlugs: ["university-of-oxford", "university-of-cambridge"],
    popularJobs: [
      "Investment Banking — Goldman/JPM/MS London (£90-130k + bonus = ₹1.5-2.5 Cr)",
      "Sales & Trading (£85-110k + bonus = ₹1.2-2 Cr)",
      "Hedge Fund / Quant Researcher (£100-150k = ₹1.5-3 Cr)",
      "Equity Research at BlackRock/Citadel (£75-100k)",
      "Strategy at PE firms — Apollo/KKR London (£80-110k)",
    ],
    startingSalaryINR: "₹95 L - 1.5 Cr (£90-130k base + bonus)",
    postStudyVisa: "2-year Graduate Route visa",
    scholarshipsHint: "Rhodes Scholarship at Oxford, Felix Scholarship at LSE/Oxford (3 Indians/year), LBS Scholarship (need + merit), Inlaks Foundation, Reliance Dhirubhai Fellowship at LSE",
    faqs: [
      {
        q: "Is MSc Finance in UK worth it for Indian students?",
        a: "Yes — top ROI in finance careers. ₹65 L cost + £90-130k London IB salary = positive payback in 1-2 years. London is the world's #1 financial center; LSE/LBS Finance alumni dominate at Goldman/JPM/MS. Even returning to India post-MS, you'll land senior IB Mumbai roles at ₹50-90 L. 1-year format is the cheapest path to top-tier finance career.",
      },
      {
        q: "Which UK university has the best MSc Finance for Indians?",
        a: "LSE MSc Finance — ranked #1 in Europe for finance MS, #2-3 globally. Most Indian alumni at Goldman, JPM, Morgan Stanley. LBS MSc Finance — similar prestige, slightly more 'workforce' focused. Oxford Said MFE — Oxford brand value + 9-month program. Imperial College Finance — strong quant + tech finance angle. For Indians, LSE > LBS > Oxford > Imperial in finance recruiting weight.",
      },
      {
        q: "What GMAT score do I need for LSE or LBS Finance Masters?",
        a: "LSE MSc Finance: GMAT 720+ median (admitted Indians often 740+). LBS MSc Finance: GMAT 720+ median. Oxford MFE: GMAT 710+. These are MSc programs (not MBA) — so quantitative aptitude matters more than verbal. Strong Indian engineering undergrad (8.5+/10 CGPA) + GMAT 720+ + Indian banking/consulting work-experience (1-3 years) gives strong admission profile.",
      },
      {
        q: "Can I get into London investment banking after MSc Finance from UK?",
        a: "Yes — LSE/LBS Finance graduates have 80%+ placement at IBs (Goldman, JPM, MS, BoA, Citi, Barclays). Indian students compete with global candidates but typically place equally well due to strong quant backgrounds. Recruitment cycle: summer internship in year before graduation → return offers. Off-cycle hiring for non-LSE/LBS schools is harder but possible via boutiques.",
      },
    ],
  },
];

export function getCourseBySlug(slug: string): CourseData | undefined {
  return COURSES.find(c => c.slug === slug);
}

export function getAllCourseSlugs(): string[] {
  return COURSES.map(c => c.slug);
}
