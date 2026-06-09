/**
 * Country-by-country data for /study-in/{country} programmatic SEO pages.
 *
 * Each entry generates a full landing page targeting buyer-intent queries:
 *   - "study in {country} from India"           (1k-15k searches/mo)
 *   - "cost of studying in {country}"          (5k-50k searches/mo)
 *   - "{country} student visa for Indians"     (2k-10k searches/mo)
 *   - "best universities in {country}"         (5k-30k searches/mo)
 *
 * Numbers below are conservative real-world ranges as of mid-2026.
 * Update annually; the page renders a "Updated" badge.
 */

export interface CountryData {
  slug:                string;
  name:                string;
  flag:                string;
  capital:             string;

  // SEO
  metaTitle:           string;
  metaDescription:     string;

  // Stats (shown in hero + Key Facts box for AI extraction)
  popularity:          number;        // QS-style rank for Indian students (1-15)
  indianStudentsCount: string;        // e.g. "270,000+"
  tuitionRange:        string;        // e.g. "₹15-50 L/year"
  livingCost:          string;        // e.g. "₹8-15 L/year"
  visaType:            string;        // e.g. "F-1 Student Visa"
  visaProcessing:      string;        // e.g. "3-5 weeks"
  workWhileStudying:   string;        // e.g. "20 hrs/week on campus"
  postStudyWork:       string;        // e.g. "1-3 year OPT"
  englishRequirement:  string;        // e.g. "IELTS 6.5 / TOEFL 90"

  // Soft data
  intro:               string;         // 2-3 sentences for TL;DR
  whyStudyHere:        string[];       // 4-6 bullet points
  topUniversities:     string[];       // 5-8 university names
  popularCourses:      string[];
  topCities:           { name: string; for: string }[];
  averageMonthlyExpenses: { item: string; inr: string }[];

  // Visa
  visaSteps:           { title: string; detail: string }[];
  documentsRequired:   string[];

  // FAQs (will be turned into FAQPage schema)
  faqs: { q: string; a: string }[];
}

export const COUNTRIES: CountryData[] = [
  {
    slug: "usa",
    name: "USA",
    flag: "🇺🇸",
    capital: "Washington, D.C.",
    metaTitle: "Study in USA from India 2027: Complete Guide for Indian Students",
    metaDescription: "Complete 2027 guide to studying in USA from India: 270,000+ Indian students, top universities, F-1 visa, costs in ₹, scholarships, and post-study work (OPT) explained.",
    popularity: 1,
    indianStudentsCount: "270,000+",
    tuitionRange: "₹25-65 L/year",
    livingCost: "₹10-20 L/year",
    visaType: "F-1 Student Visa",
    visaProcessing: "3-5 weeks",
    workWhileStudying: "20 hrs/week on-campus",
    postStudyWork: "12 months OPT (+24 mo STEM extension)",
    englishRequirement: "TOEFL 90+ / IELTS 6.5+ / Duolingo 115+",

    intro: "USA hosts more Indian students than any other country — 270,000+ at last count. With 4 of the world's top 10 universities, the strongest post-study work options (OPT + STEM extension up to 3 years), and the largest Indian alumni network, it remains the #1 destination despite the highest costs.",

    whyStudyHere: [
      "4 of the world's top 10 universities (MIT, Stanford, Harvard, Caltech)",
      "3-year STEM OPT lets you work + repay loans before deciding on H-1B",
      "Largest Indian student + alumni community (270,000+ active students)",
      "Most generous scholarships at the top tier (Knight-Hennessy, Fulbright)",
      "Strongest research funding — RAships often cover full tuition",
      "Loan options without collateral (Prodigy, MPOWER) work here",
    ],

    topUniversities: [
      "Massachusetts Institute of Technology (MIT)",
      "Stanford University",
      "Harvard University",
      "University of California, Berkeley",
      "Carnegie Mellon University",
      "Cornell University",
      "Yale University",
      "University of Chicago",
    ],

    popularCourses: [
      "MS Computer Science", "MBA", "MS Data Science",
      "MS Electrical Engineering", "MS Finance", "MS Biotechnology",
    ],

    topCities: [
      { name: "Boston",        for: "Top universities (MIT, Harvard, BU, Northeastern)" },
      { name: "Bay Area",      for: "Tech + Stanford + Berkeley" },
      { name: "New York",      for: "Finance + Columbia + NYU" },
      { name: "Los Angeles",   for: "Film, business + USC + UCLA" },
      { name: "Chicago",       for: "Business + UChicago + Northwestern" },
    ],

    averageMonthlyExpenses: [
      { item: "Rent (shared)",        inr: "₹45,000 - ₹85,000" },
      { item: "Groceries + Eating",   inr: "₹18,000 - ₹30,000" },
      { item: "Transport",            inr: "₹6,000 - ₹12,000" },
      { item: "Health Insurance",     inr: "₹10,000 - ₹18,000" },
      { item: "Phone + Internet",     inr: "₹4,000 - ₹6,000" },
      { item: "Miscellaneous",        inr: "₹12,000 - ₹20,000" },
    ],

    visaSteps: [
      { title: "Get I-20 from university",     detail: "After accepting your admission, the university issues an I-20 form. You cannot apply for a visa without it." },
      { title: "Pay SEVIS fee",                 detail: "$350 SEVIS fee paid online — keep the receipt." },
      { title: "Fill DS-160 form",              detail: "Online non-immigrant visa application. Save the confirmation number." },
      { title: "Schedule visa interview",       detail: "Book at any US consulate in India (Mumbai, Delhi, Chennai, Hyderabad, Kolkata). Wait times: 1-8 weeks depending on city." },
      { title: "Attend interview",              detail: "Carry I-20, DS-160 confirmation, SEVIS receipt, passport, fee receipt, financial documents, university admission letter, and academic records." },
      { title: "Visa decision",                 detail: "Usually communicated same day. Passport returned in 5-10 working days." },
    ],

    documentsRequired: [
      "Valid passport (6+ months validity beyond intended stay)",
      "I-20 form from university",
      "DS-160 confirmation page",
      "SEVIS I-901 fee receipt ($350)",
      "Visa application fee receipt ($185)",
      "Academic transcripts and degree certificates",
      "Standardized test scores (GRE/GMAT/TOEFL/IELTS)",
      "Financial documents (bank statements, loan letter)",
      "Sponsor's affidavit (if family is funding)",
      "Recent photographs (2x2 inch, white background)",
    ],

    faqs: [
      {
        q: "How much does it cost to study in USA from India in 2027?",
        a: "Total cost ranges from ₹35 L (state universities) to ₹85 L+ per year (Ivy League). Tuition alone is ₹25-65 L/year for most programs, plus ₹10-20 L/year for living expenses (varies by city — NYC + Bay Area are highest, smaller cities cheaper). A 2-year Masters typically costs ₹70 L - ₹1.7 Cr total. Most Indian students fund this via education loans (HDFC Credila, SBI, Prodigy, MPOWER) and on-campus jobs/RAships.",
      },
      {
        q: "Is the F-1 student visa easy to get for Indian students?",
        a: "Yes, if you're well-prepared. F-1 visa approval rates for Indian students are 75-85% depending on the consulate. Key factors: genuine intent to study, ability to fund your education (loan + savings), strong academic record, clear plan for after graduation. Most rejections happen because of weak financial documents or vague answers about post-study plans. Mumbai consulate is generally fastest; Chennai has the longest wait times.",
      },
      {
        q: "Can I work while studying in USA on F-1 visa?",
        a: "Yes, but with restrictions. On-campus: 20 hours/week during semester, full-time during breaks. Off-campus: only allowed after 1 year via CPT (Curricular Practical Training) for internships related to your course, or OPT (Optional Practical Training) for paid work after graduation. STEM students get a 24-month OPT extension (3 years total) — this is the biggest advantage of US study.",
      },
      {
        q: "What scholarships are available for Indian students in USA?",
        a: "Multiple options: Fulbright-Nehru (master's, fully funded), Knight-Hennessy at Stanford (fully funded grad), Tata Scholarships at Cornell (undergrad), Inlaks (master's anywhere), university-specific aid (research assistantships, teaching assistantships). Most US universities offer some need-based aid. Apply to multiple — top universities often cover 50-100% of tuition for accepted Indian students.",
      },
      {
        q: "How long can I stay in USA after my degree?",
        a: "On OPT: 12 months (1 year) for any field. STEM students get +24 months extension (3 years total). After OPT, you need an H-1B visa (lottery, capped at 65,000/year) or another visa to continue working. Many Indian students transition to H-1B → green card via employer sponsorship. The path is long but well-defined.",
      },
      {
        q: "Which universities are best for Indian students in USA?",
        a: "Depends on field. For CS/STEM: MIT, Stanford, CMU, UC Berkeley, Georgia Tech, UIUC, Cornell. For MBA: Stanford GSB, Harvard, Wharton, Booth, MIT Sloan. For finance: Columbia, NYU Stern, MIT. For undergrad: Ivy League + UCs + top liberal arts. State universities (UT Austin, UMich, Purdue) offer great ROI for Indians on a budget — strong programs at lower cost.",
      },
    ],
  },

  {
    slug: "uk",
    name: "UK",
    flag: "🇬🇧",
    capital: "London",
    metaTitle: "Study in UK from India 2027: Complete Guide for Indian Students",
    metaDescription: "Complete 2027 guide to studying in UK from India: 100,000+ Indian students, top universities like Oxford & Cambridge, Tier 4 visa, costs in INR, Chevening + Commonwealth scholarships.",
    popularity: 2,
    indianStudentsCount: "140,000+",
    tuitionRange: "₹18-35 L/year",
    livingCost: "₹8-15 L/year",
    visaType: "Student Route (Tier 4)",
    visaProcessing: "3 weeks (priority: 5 days)",
    workWhileStudying: "20 hrs/week",
    postStudyWork: "2-year Graduate Route visa (3 for PhD)",
    englishRequirement: "IELTS 6.0-7.0 / TOEFL 90-100",

    intro: "UK is the second-largest destination for Indian students — 140,000+ enrolled, growing 40% year-on-year since the 2-year post-study Graduate Route returned. Shorter degrees (1-year Masters), top universities, and easy work-permission make UK a strong choice for budget-conscious Indian students.",

    whyStudyHere: [
      "Most 1-year Master's programs save ₹15-25 L vs USA",
      "2-year Graduate Route visa — work in UK after graduation",
      "Oxford, Cambridge, Imperial, UCL all in QS top 10",
      "Chevening + Commonwealth scholarships specifically for Indians",
      "Direct flights to most Indian metros",
      "Strong Indian diaspora — 1.8 million Indian-origin residents",
    ],

    topUniversities: [
      "University of Oxford", "University of Cambridge",
      "Imperial College London", "London School of Economics (LSE)",
      "University College London (UCL)", "King's College London",
      "University of Edinburgh", "University of Manchester",
    ],

    popularCourses: [
      "MSc Computer Science", "MBA", "MSc Finance",
      "MSc Data Science", "MSc International Business", "LLM",
    ],

    topCities: [
      { name: "London",      for: "World-class universities + jobs (UCL, LSE, Imperial, KCL)" },
      { name: "Oxford",      for: "Oxford University + research" },
      { name: "Cambridge",   for: "Cambridge University + STEM" },
      { name: "Edinburgh",   for: "Best non-London city for students" },
      { name: "Manchester",  for: "Cheaper than London, top Russell Group uni" },
    ],

    averageMonthlyExpenses: [
      { item: "Rent (shared, London)",   inr: "₹65,000 - ₹95,000" },
      { item: "Rent (outside London)",   inr: "₹35,000 - ₹55,000" },
      { item: "Groceries",               inr: "₹15,000 - ₹22,000" },
      { item: "Transport",               inr: "₹6,000 - ₹12,000" },
      { item: "Phone + Internet",        inr: "₹3,000 - ₹4,500" },
      { item: "Miscellaneous",           inr: "₹10,000 - ₹15,000" },
    ],

    visaSteps: [
      { title: "Get CAS from university", detail: "Confirmation of Acceptance for Studies — issued after you pay deposit." },
      { title: "Prepare financial proof", detail: "Show 28 days of bank balance covering tuition + £1,334/month London (or £1,023/month elsewhere) for up to 9 months." },
      { title: "Pay IHS (Immigration Health Surcharge)", detail: "£776/year — gives you free NHS healthcare." },
      { title: "Apply online", detail: "Through UKVI portal with CAS, passport, photos, biometrics." },
      { title: "Book biometric appointment", detail: "At a VFS center in India — Delhi, Mumbai, Chennai, Kolkata, Bangalore." },
      { title: "Receive vignette + BRP", detail: "Visa stamp for 90 days to enter UK. Pick up BRP in UK within 10 days of arrival." },
    ],

    documentsRequired: [
      "Valid passport",
      "CAS letter from university",
      "Tuberculosis test certificate (Indian students require it)",
      "IELTS/TOEFL/PTE scorecard",
      "Academic transcripts",
      "Bank statements (28 days)",
      "Loan sanction letter (if applicable)",
      "IHS payment receipt",
      "ATAS certificate (for certain STEM courses)",
    ],

    faqs: [
      {
        q: "How much does it cost to study in UK from India in 2027?",
        a: "Total cost: ₹26-50 L per year. Tuition ₹18-35 L (cheaper than USA) + living ₹8-15 L (London expensive, other cities cheaper). A 1-year Master's costs ₹26-50 L total — half of what a 2-year US Master's costs. Combined with the 2-year post-study work visa, UK gives much better ROI for budget-conscious students.",
      },
      {
        q: "What is the UK Graduate Route visa for Indian students?",
        a: "After graduating, you can stay in UK for 2 years (3 for PhD) and work or look for jobs — no employer sponsorship needed during this period. Apply within your visa validity, pay ~£822 fee + IHS. After Graduate Route, you transition to Skilled Worker visa via an employer (£26,200+ salary), eventually leading to ILR (permanent residence) in 5 years.",
      },
      {
        q: "Can I get a scholarship for UK studies from India?",
        a: "Yes — many options. Chevening (fully funded, Indian govt + UK govt partnership): ~70 Indian students/year. Commonwealth Scholarship: fully funded, master's + PhD. Rhodes Scholarship at Oxford: 5 Indian students/year, fully funded. Inlaks: any UK uni, partial. Plus university-specific awards (Oxford Clarendon, Edinburgh Global, etc). Most require applying 12-18 months before intake.",
      },
      {
        q: "Is IELTS mandatory for UK student visa from India?",
        a: "Yes for most students, but with relaxations. UKVI accepts: IELTS UKVI Academic (6.0-7.0 depending on course), TOEFL iBT, PTE Academic, or Cambridge English. Some universities accept Class XII English marks (typically 70%+ in CBSE/ICSE) — verify with your specific university. Most Indian students take IELTS Academic (UKVI version).",
      },
      {
        q: "How long can I stay in UK after my degree?",
        a: "Graduate Route gives 2 years (Bachelor's/Master's) or 3 years (PhD) of post-study work — no employer needed. After that, you need a Skilled Worker visa from an employer (sponsorship needed). After 5 years on Skilled Worker, you can apply for ILR (Indefinite Leave to Remain) = permanent residence. After ILR, 12 more months to UK citizenship.",
      },
      {
        q: "Which UK universities are best for Indian students?",
        a: "For top brand + scholarships: Oxford, Cambridge, Imperial, LSE, UCL. For value (good ranking + affordable + welcoming): Manchester, Warwick, Bristol, Glasgow, Edinburgh, Sheffield, Nottingham. For specific fields: LSE for economics/finance, Imperial for engineering, KCL for medicine + law. Russell Group (24 elite UK universities) is the safe choice — all are well-respected.",
      },
    ],
  },

  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    capital: "Ottawa",
    metaTitle: "Study in Canada from India 2027: Complete Guide for Indian Students",
    metaDescription: "Complete 2027 guide to studying in Canada from India: 320,000+ Indian students, Study Permit, PR pathway via Express Entry, costs in INR, top universities like UofT, UBC, McGill.",
    popularity: 3,
    indianStudentsCount: "320,000+",
    tuitionRange: "₹12-25 L/year",
    livingCost: "₹6-12 L/year",
    visaType: "Study Permit",
    visaProcessing: "8-12 weeks (SDS: 20 days)",
    workWhileStudying: "20 hrs/week off-campus",
    postStudyWork: "PGWP up to 3 years + PR pathway",
    englishRequirement: "IELTS 6.0+ / TOEFL 86+ / PTE 60+",

    intro: "Canada is now the #1 destination for Indian students for sheer numbers — 320,000+ enrolled, more than USA. Post-study work permits (up to 3 years), straightforward PR pathway via Express Entry, lower tuition than USA, and welcoming culture make Canada the smartest long-term play for Indians wanting to immigrate.",

    whyStudyHere: [
      "Clearest PR pathway — most students get PR within 2-4 years post-graduation",
      "Post-Graduation Work Permit (PGWP) up to 3 years, no employer needed",
      "Tuition 30-50% cheaper than USA/UK",
      "320,000+ Indian students = massive support network",
      "SDS (Student Direct Stream) visa in just 20 days for Indians",
      "Free healthcare for students in most provinces (BC, AB, MB)",
    ],

    topUniversities: [
      "University of Toronto", "McGill University",
      "University of British Columbia (UBC)", "University of Alberta",
      "University of Waterloo", "McMaster University",
      "Queen's University", "Western University",
    ],

    popularCourses: [
      "MS Computer Science", "Postgraduate Diplomas (PG Cert at colleges)",
      "MBA", "MS Data Science", "MEng",
      "BBA / Bachelor of Commerce",
    ],

    topCities: [
      { name: "Toronto",     for: "Largest Indian community + UofT" },
      { name: "Vancouver",   for: "UBC + tech industry + lifestyle" },
      { name: "Montreal",    for: "McGill + cheapest big city" },
      { name: "Waterloo",    for: "Tech (Google, BlackBerry, RIM hub)" },
      { name: "Calgary",     for: "Energy + lower cost of living" },
    ],

    averageMonthlyExpenses: [
      { item: "Rent (shared)",        inr: "₹40,000 - ₹70,000" },
      { item: "Groceries",            inr: "₹15,000 - ₹22,000" },
      { item: "Transport",            inr: "₹5,000 - ₹8,000" },
      { item: "Phone + Internet",     inr: "₹4,500 - ₹6,500" },
      { item: "Health Insurance",     inr: "₹4,000 - ₹6,000" },
      { item: "Miscellaneous",        inr: "₹8,000 - ₹14,000" },
    ],

    visaSteps: [
      { title: "Get Letter of Acceptance (LOA)", detail: "From a Designated Learning Institution (DLI). Must be DLI — non-DLI schools don't qualify for study permits." },
      { title: "Pay 1-year tuition upfront",     detail: "Required for SDS (Student Direct Stream) — gives you 20-day processing." },
      { title: "Get GIC (₹6.7 L equivalent)",    detail: "Guaranteed Investment Certificate from Scotiabank/ICICI/CIBC — proves you can support yourself." },
      { title: "Get IELTS 6.0+ band score",      detail: "Required for SDS. Otherwise, regular processing takes 8-12 weeks." },
      { title: "Apply online via IRCC",          detail: "Upload all documents to canada.ca portal. Pay $150 CAD permit fee + $85 biometric fee." },
      { title: "Biometrics + medical",           detail: "Biometrics at VFS in India. Medical exam by IRCC-approved doctors." },
    ],

    documentsRequired: [
      "Letter of Acceptance from DLI",
      "Valid passport",
      "Proof of funds (GIC + tuition paid receipt for SDS)",
      "IELTS scorecard (6.0+ for SDS)",
      "Academic transcripts and certificates",
      "Statement of Purpose (SOP)",
      "Medical examination report",
      "Police clearance certificate",
      "Photographs (35x45mm, white background)",
    ],

    faqs: [
      {
        q: "How much does it cost to study in Canada from India in 2027?",
        a: "Total cost: ₹18-37 L per year for a 2-year program at a public university. Tuition ₹12-25 L/year (universities) or ₹8-15 L/year (community colleges). Living ₹6-12 L/year (Toronto/Vancouver higher, smaller cities cheaper). For a 2-year Master's: ₹40-75 L total — significantly cheaper than USA. Plus you can work 20 hrs/week and earn ~₹50-60k/month CAD-equivalent during studies.",
      },
      {
        q: "What is the Student Direct Stream (SDS) for Indian students?",
        a: "SDS is a fast-track Canada study visa for Indian students. Requirements: IELTS 6.0+, paid first-year tuition, GIC of CAD $10,000 (~₹6.7 L). Processing time: 20 days vs 8-12 weeks for regular applications. 75-80% approval rate vs 60% for regular. If you meet all 3 requirements, always go SDS — it's faster, cheaper, and more reliable.",
      },
      {
        q: "Can I get PR in Canada after my degree?",
        a: "Yes — Canada has the clearest PR pathway of any major study destination. After studying 2+ years at a public DLI, you get Post-Graduation Work Permit (PGWP) up to 3 years. During that time, work + improve French/English + gain Canadian Experience Class points → apply for PR via Express Entry. Most Indian students with engineering/STEM degrees get PR within 2-3 years post-graduation. Provincial Nominee Programs (PNP) are an alternative faster route.",
      },
      {
        q: "Are community colleges in Canada worth it for Indians?",
        a: "Yes — many Indian students do PG Diplomas at colleges (1-2 years) for ROI. Cheaper tuition (₹8-15 L/year vs ₹12-25 L at universities), shorter programs (1-2 years), and same PGWP eligibility (if 2+ year program). Top colleges: Seneca, Centennial, Humber, George Brown (Toronto area), Sheridan, Conestoga. Caveat: a college diploma carries less weight than a university degree for white-collar jobs — best for trades, IT support, hospitality, healthcare.",
      },
      {
        q: "Which provinces are best for Indian students in Canada?",
        a: "Ontario (Toronto + Waterloo area) has the most universities and jobs but is most expensive. British Columbia (Vancouver area, UBC) is gorgeous but pricey. Quebec (Montreal, McGill) is cheap but you'll need basic French. Alberta (Calgary, Edmonton) has lower cost of living and easier PR via AINP. Manitoba (Winnipeg) is the cheapest with fastest PR via Manitoba PNP — increasingly popular among Indian students for that reason.",
      },
      {
        q: "How long can I stay in Canada after my degree?",
        a: "Post-Graduation Work Permit (PGWP): up to 3 years if you did a 2+ year program. Use this time to gain Canadian work experience for Express Entry. After 1 year of skilled work, you can apply for PR. Once you get PR, you can stay forever and apply for citizenship after 3 years. Most Indian students follow: Study → PGWP → Skilled Work → PR → Citizenship over 6-8 years total.",
      },
    ],
  },

  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    capital: "Canberra",
    metaTitle: "Study in Australia from India 2027: Complete Guide for Indian Students",
    metaDescription: "Complete 2027 guide to studying in Australia from India: 100,000+ Indian students, Subclass 500 visa, top universities like Melbourne & Sydney, costs in INR, post-study work visa.",
    popularity: 4,
    indianStudentsCount: "100,000+",
    tuitionRange: "₹17-32 L/year",
    livingCost: "₹10-17 L/year",
    visaType: "Subclass 500 Student Visa",
    visaProcessing: "4-6 weeks",
    workWhileStudying: "48 hrs/fortnight",
    postStudyWork: "Subclass 485 (2-4 years)",
    englishRequirement: "IELTS 6.5+ / TOEFL 79+ / PTE 58+",

    intro: "Australia is the 4th-largest destination for Indian students with 100,000+ enrolled. 7 universities in the QS top 50, post-study work visa up to 4 years for regional graduates, and a clear pathway to PR via skilled migration make it a strong choice. Quality of life is exceptional — beaches, weather, and a vibrant Indian community across major cities.",

    whyStudyHere: [
      "7 universities in QS top 50 (Melbourne, Sydney, ANU, UNSW, Queensland, Monash, Adelaide)",
      "Subclass 485 post-study work visa: 2-4 years depending on degree and location",
      "Clearest pathway to skilled migration via SkillSelect (Subclass 189/190)",
      "Higher hourly wages while studying (AUD 25-35/hour) than UK/Canada",
      "Regional universities offer faster PR + extra 1-2 years post-study work",
      "Strong demand for nurses, IT, engineering, accounting — all Indian-student-friendly",
    ],

    topUniversities: [
      "University of Melbourne", "University of Sydney",
      "Australian National University (ANU)", "University of Queensland",
      "University of New South Wales (UNSW)", "Monash University",
      "University of Adelaide", "University of Western Australia",
    ],

    popularCourses: [
      "Master of IT / Information Systems", "MBA", "Master of Engineering",
      "Master of Nursing", "Master of Accounting / Professional Accounting",
      "Master of Data Science", "Bachelor of Business / Commerce",
    ],

    topCities: [
      { name: "Melbourne",  for: "Top university + voted world's most liveable city" },
      { name: "Sydney",     for: "Largest Indian community + UNSW + finance jobs" },
      { name: "Brisbane",   for: "Cheaper, sunny, UQ + Queensland tech industry" },
      { name: "Perth",      for: "Quieter + mining jobs + UWA" },
      { name: "Adelaide",   for: "Regional benefits + cheaper living" },
    ],

    averageMonthlyExpenses: [
      { item: "Rent (shared)",        inr: "₹50,000 - ₹90,000" },
      { item: "Groceries",            inr: "₹20,000 - ₹28,000" },
      { item: "Transport",            inr: "₹7,500 - ₹12,000" },
      { item: "Health Insurance (OSHC)", inr: "₹4,000 - ₹5,500" },
      { item: "Phone + Internet",     inr: "₹3,500 - ₹5,000" },
      { item: "Miscellaneous",        inr: "₹10,000 - ₹16,000" },
    ],

    visaSteps: [
      { title: "Get CoE (Confirmation of Enrolment)", detail: "From university after accepting offer + paying deposit." },
      { title: "Take OSHC (health cover)",             detail: "Mandatory health insurance — ~AUD 600/year. Multiple providers available." },
      { title: "Prepare financial proof",              detail: "Show AUD 24,505 for 12 months living costs + tuition + travel money (~₹26 L total)." },
      { title: "Get IELTS / PTE",                       detail: "Most universities require IELTS 6.5 / PTE 58. Subclass 500 visa requires same." },
      { title: "Apply online via ImmiAccount",          detail: "Upload CoE, OSHC, English score, financial docs, academic records, GTE statement. Visa fee AUD 710." },
      { title: "GTE Statement + biometrics",            detail: "Write a strong Genuine Temporary Entrant statement explaining why Australia + post-study plans. Biometrics at VFS." },
    ],

    documentsRequired: [
      "Valid passport",
      "Confirmation of Enrolment (CoE)",
      "OSHC (Overseas Student Health Cover)",
      "GTE Statement (Genuine Temporary Entrant)",
      "IELTS / PTE / TOEFL scorecard",
      "Financial proof (bank statements, loan sanction)",
      "Academic transcripts",
      "Statement of Purpose",
      "Photographs (35x45mm)",
    ],

    faqs: [
      {
        q: "How much does it cost to study in Australia from India in 2027?",
        a: "Total cost: ₹27-49 L per year. Tuition ₹17-32 L/year at top universities (Group of 8 most expensive). Living ₹10-17 L/year — Sydney + Melbourne highest, Adelaide + Perth cheaper. A 2-year Master's: ₹55-95 L total. Slightly cheaper than USA but more expensive than UK/Canada. Higher hourly wages (AUD 25-35) make it easier to cover living costs while studying.",
      },
      {
        q: "What is the Subclass 485 post-study work visa for Australia?",
        a: "After graduating from an eligible Australian course, you can stay 2-4 years on Subclass 485: 2 years for Bachelor's/Master's by coursework, 3 years for Master's by research, 4 years for PhD. Regional graduates get +1-2 extra years (e.g. Adelaide, Brisbane, Perth all count as 'regional'). During this time, you can work full-time in any role — gain points for skilled migration (Subclass 189/190) leading to PR.",
      },
      {
        q: "Can I get PR in Australia after studying?",
        a: "Yes, but it's competitive. After post-study work (Subclass 485), you accumulate points for skilled migration via SkillSelect. Points awarded for: age (under 33 = max), English (PTE 79+ recommended), education (Master's = bonus), Australian work experience (1-3 years post-study). Get 65+ points minimum, but 80+ usually needed for invite. Apply for Subclass 189 (independent) or 190 (state-sponsored). State sponsorships via PNPs are often faster — Tasmania, Northern Territory most welcoming.",
      },
      {
        q: "Which is better for Indians — Australia or Canada?",
        a: "Depends on priorities. Canada: cheaper, clearer PR (Express Entry is more predictable), faster (PR in 2-4 years), bigger Indian community, brutal winters. Australia: better weather + lifestyle, slightly more expensive, harder PR (more competitive points-based), but higher quality universities (7 in QS top 50 vs Canada's 3). Australia better for medicine, engineering, IT careers; Canada better if your main goal is fast immigration.",
      },
      {
        q: "Can Indian students work full-time in Australia while studying?",
        a: "No — 48 hours per fortnight (2 weeks) limit during semester, but unlimited during official holidays. Average wages: AUD 25-35/hour. Common jobs for Indian students: retail (Coles, Woolworths), hospitality (cafes, restaurants), uber/delivery, university roles (RA, tutoring), warehouse work. Many Indian students earn AUD 1,200-2,000/month (~₹65k-₹1.1 L), enough to cover rent + groceries.",
      },
      {
        q: "Which Australian universities accept Indian students with average grades?",
        a: "Group of 8 (Melbourne, Sydney, ANU, UQ, UNSW, Monash, Adelaide, UWA) want 65-75%+ in undergrad. Other strong unis with easier entry: Macquarie, RMIT, UTS, Curtin, La Trobe, Western Sydney, Deakin — accept 60-65%+ in undergrad. Regional universities (Charles Sturt, Federation, USQ) accept 55-60% and offer PR bonuses. Indian Bachelor's degrees considered equivalent to Australian Bachelor's by all universities.",
      },
    ],
  },

  {
    slug: "germany",
    name: "Germany",
    flag: "🇩🇪",
    capital: "Berlin",
    metaTitle: "Study in Germany from India 2027: Free Tuition Guide for Indian Students",
    metaDescription: "Complete guide to studying in Germany from India 2027: 50,000+ Indian students, FREE tuition at public universities, blocked account, top universities like TUM & RWTH Aachen.",
    popularity: 5,
    indianStudentsCount: "50,000+",
    tuitionRange: "₹0 (public unis) - ₹15 L (private)",
    livingCost: "₹8-12 L/year",
    visaType: "National Student Visa",
    visaProcessing: "6-12 weeks",
    workWhileStudying: "120 full days / 240 half days per year",
    postStudyWork: "18-month Jobseeker visa",
    englishRequirement: "IELTS 6.0+ for English programs / Basic German for German programs",

    intro: "Germany is the #1 destination for Indian engineers seeking world-class education on a budget. Public universities charge ZERO tuition (only a small semester fee of €150-350), and Germany has 50,000+ Indian students enrolled. The 18-month post-study jobseeker visa + path to permanent residence + EU Blue Card make it Europe's best long-term destination.",

    whyStudyHere: [
      "TUITION-FREE at all public universities (only €150-350/semester fee)",
      "Top engineering universities — TU Munich, RWTH Aachen, KIT (top 50 globally)",
      "18-month post-study work visa to find a job",
      "EU Blue Card → permanent residence in 21-33 months (fastest in EU)",
      "200+ English-taught Master's programs (no German required)",
      "Strong economy + engineering jobs at BMW, Bosch, Siemens, SAP, Mercedes",
    ],

    topUniversities: [
      "Technical University of Munich (TUM)", "RWTH Aachen University",
      "Karlsruhe Institute of Technology (KIT)", "Humboldt University Berlin",
      "Heidelberg University", "Free University of Berlin",
      "Technical University of Berlin", "University of Stuttgart",
    ],

    popularCourses: [
      "MS Mechanical Engineering", "MS Computer Science",
      "MS Electrical Engineering", "MS Data Engineering",
      "MS Automotive Engineering", "MS Automation",
    ],

    topCities: [
      { name: "Munich",       for: "TUM + BMW/Siemens jobs + top quality of life" },
      { name: "Berlin",       for: "Cheapest big city + tech startups + buzzing student scene" },
      { name: "Aachen",       for: "RWTH + cheaper than Munich" },
      { name: "Stuttgart",    for: "Mercedes/Porsche + engineering hub" },
      { name: "Hamburg",      for: "Northern Germany + lower competition" },
    ],

    averageMonthlyExpenses: [
      { item: "Rent (shared, WG)",    inr: "₹30,000 - ₹50,000" },
      { item: "Groceries",            inr: "₹15,000 - ₹20,000" },
      { item: "Health Insurance",     inr: "₹10,000 - ₹12,000 (mandatory)" },
      { item: "Transport",            inr: "Included in semester fee + €30/month" },
      { item: "Phone + Internet",     inr: "₹2,500 - ₹3,500" },
      { item: "Miscellaneous",        inr: "₹8,000 - ₹12,000" },
    ],

    visaSteps: [
      { title: "Get admission letter (Zulassungsbescheid)", detail: "From a German university — usually 4-8 weeks after applying." },
      { title: "Open Blocked Account (Sperrkonto)",          detail: "Deposit €11,904 (₹10.6 L) in Fintiba/Expatrio — mandatory proof of funds for student visa." },
      { title: "Take German health insurance",                detail: "TK / AOK / Mawista — ~€110/month. Required before visa." },
      { title: "Get language proficiency",                    detail: "IELTS 6.0-6.5 for English programs, or A1 German for some." },
      { title: "Apply at German embassy in India",            detail: "Delhi, Mumbai, Chennai, Kolkata, Bangalore. Pay €75 visa fee. Submit Blocked Account, insurance, admission letter, transcripts." },
      { title: "Attend visa interview",                       detail: "Usually scheduled 2-4 weeks after appointment booking. Decision in 6-12 weeks." },
    ],

    documentsRequired: [
      "Valid passport",
      "University admission letter (Zulassungsbescheid)",
      "Blocked account confirmation (€11,904 deposit)",
      "Health insurance proof",
      "Academic transcripts (with English translations)",
      "Statement of Purpose (Motivationsschreiben)",
      "Language proficiency certificate (IELTS / German)",
      "Visa fee receipt (€75)",
      "Photographs (biometric, 45x35mm)",
    ],

    faqs: [
      {
        q: "Is it true that studying in Germany is free for Indian students?",
        a: "Yes, at public universities. Public universities charge ZERO tuition fees — only a semester contribution of €150-350 (~₹13,000-30,000/semester) which covers student services + semester public transport ticket. The only exception is Baden-Württemberg state (Heidelberg, Stuttgart, Karlsruhe) which charges €1,500/semester for non-EU students. Private universities (like SRH, Jacobs, EBS) charge €15,000-25,000/year but are rare and not recommended for Indians on a budget.",
      },
      {
        q: "How much does it actually cost to study in Germany from India?",
        a: "Total cost: ₹10-15 L per year (vs ₹35+ L in USA). Tuition: €0-300/semester (free!). Living: €850-1,100/month (₹76,000-99,000) — Munich expensive, Berlin/Leipzig much cheaper. Health insurance mandatory: ₹10,000/month. Blocked account: ₹10.6 L (₹71,000 access per month — yours after visa). Total realistic budget: ₹13 L/year. Working part-time (120 days/year) earns ₹5-8 L = significantly offsets costs.",
      },
      {
        q: "Do I need to know German to study in Germany?",
        a: "Not for English-taught programs (200+ English Master's available). But knowing basic German (A1-A2) helps massively for: part-time jobs, daily life, post-study job market. For undergrad: must know German (most programs are in German). For Master's: many English options, especially in engineering + business + IT — popular among Indians. For PhD: usually English-friendly, but German helps with broader career.",
      },
      {
        q: "What is the Blocked Account requirement for Germany?",
        a: "Mandatory financial proof for student visa. You deposit €11,904 (~₹10.6 L) in a blocked account (Fintiba, Expatrio, Coracle, or Deutsche Bank) before applying. After arrival in Germany, you can withdraw €992/month (~₹88,000) — designed to cover your living costs for first year. Indian education loans (HDFC Credila, SBI, Avanse) all accept Blocked Account requirement. Open the account online before visa appointment.",
      },
      {
        q: "Can I stay in Germany after my studies?",
        a: "Yes — Germany has one of Europe's best post-study options. After graduating, you get an 18-month Jobseeker Visa to find a job (€56-58/year fee). Once employed at €58,400+ salary (€43,800+ for STEM), you get an EU Blue Card. After 21 months on Blue Card + B1 German, you qualify for permanent residence (Niederlassungserlaubnis). German citizenship: 8 years (6 with B2 German + integration). The Indian engineer-in-Germany pipeline is one of the strongest in the world.",
      },
      {
        q: "Which German universities are best for Indian students?",
        a: "For engineering: TU Munich (TUM), RWTH Aachen, KIT, TU Berlin. All have huge Indian student communities. For business/economics: WHU Otto Beisheim, Mannheim, LMU Munich. For natural sciences: Heidelberg, LMU, Humboldt Berlin. For computer science: TUM, KIT, Saarland (CISPA security), HPI Potsdam. Top international students often choose programs at TUM (#37 globally) or RWTH because they have the strongest Indian-alumni-to-German-jobs pipelines.",
      },
    ],
  },

  // Add more countries as needed — Singapore, Ireland, Netherlands, etc.
  // Keeping initial set to 5 high-demand countries; can expand to 15+ later.
  {
    slug: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    capital: "Singapore",
    metaTitle: "Study in Singapore from India 2027: Complete Guide for Indian Students",
    metaDescription: "Complete 2027 guide to studying in Singapore from India: NUS, NTU top universities, Tuition Grant Scheme, low travel cost, 35,000+ Indian students.",
    popularity: 6,
    indianStudentsCount: "35,000+",
    tuitionRange: "₹15-25 L/year (after Tuition Grant)",
    livingCost: "₹10-15 L/year",
    visaType: "Student Pass",
    visaProcessing: "4-6 weeks",
    workWhileStudying: "16 hrs/week",
    postStudyWork: "1-year Visit Pass (job search)",
    englishRequirement: "IELTS 6.5+ / SAT 1200+ for undergrad",
    intro: "Singapore offers world-class education close to home with NUS and NTU both in the global top 25. The unique Tuition Grant Scheme cuts tuition by 50%+ in exchange for 3-year post-study work commitment in Singapore — making it one of the best ROI study destinations for Indians.",
    whyStudyHere: [
      "NUS + NTU both in QS top 25 globally",
      "Tuition Grant cuts fees by 50%+ (3-year work bond in Singapore)",
      "3-hour direct flight from India — easy family visits",
      "English is official language — no language barrier",
      "Strong Indian community + Indian food + cultural familiarity",
      "Gateway to Asian tech jobs (Google, Meta, ByteDance APAC HQ)",
    ],
    topUniversities: [
      "National University of Singapore (NUS)", "Nanyang Technological University (NTU)",
      "Singapore Management University (SMU)", "Singapore University of Technology and Design (SUTD)",
      "Singapore Institute of Technology", "James Cook University Singapore",
    ],
    popularCourses: [
      "MBA", "MS Computer Science", "MS Data Science",
      "MS Finance", "MS Public Policy", "Bachelor of Engineering",
    ],
    topCities: [
      { name: "Singapore (city-state)", for: "Everything is here — universities + jobs" },
    ],
    averageMonthlyExpenses: [
      { item: "Rent (shared)",        inr: "₹35,000 - ₹65,000" },
      { item: "Groceries",            inr: "₹12,000 - ₹18,000" },
      { item: "Transport",            inr: "₹4,500 - ₹6,500" },
      { item: "Health Insurance",     inr: "₹3,000 - ₹4,500" },
      { item: "Phone + Internet",     inr: "₹2,500 - ₹3,500" },
      { item: "Miscellaneous",        inr: "₹10,000 - ₹15,000" },
    ],
    visaSteps: [
      { title: "Get IPA letter from ICA",       detail: "After admission, university applies for In-Principle Approval. Takes 2-4 weeks." },
      { title: "Pay tuition deposit",            detail: "Required to confirm acceptance + secure Student Pass." },
      { title: "Medical examination",            detail: "Required for Student Pass — done in India before travel." },
      { title: "Receive Student Pass at airport",detail: "Upon arrival in Singapore, you'll be issued the Student Pass at the airport ICA counter." },
    ],
    documentsRequired: [
      "Valid passport", "University admission letter",
      "IPA letter from ICA", "Photos (white background)",
      "Medical certificate", "Tuition fee receipt",
    ],
    faqs: [
      {
        q: "How much does it cost to study in Singapore from India?",
        a: "After the Tuition Grant Scheme: ₹15-25 L/year for tuition + ₹10-15 L/year for living = ₹25-40 L/year total. The Tuition Grant cuts tuition by 50%+ in exchange for a 3-year work bond in Singapore post-graduation — most Indian students happily take it because Singapore salaries are excellent (SGD 4,000-6,000/month for fresh grads). Without the Grant, tuition is ~₹30-50 L/year.",
      },
      {
        q: "What is the Tuition Grant Scheme for Indian students in Singapore?",
        a: "A government subsidy that reduces tuition fees by 50%+ for international students at NUS, NTU, SMU. In exchange, you must work in Singapore for 3 years after graduation (with a registered Singapore company — easy for grads). It's automatic if you accept it — no separate application. Saves ₹15-25 L total. Almost all Indian students take it because Singapore work experience + bond fulfillment opens up the path to Permanent Residence.",
      },
      {
        q: "Can I stay in Singapore after my degree?",
        a: "Yes — 1-year Visit Pass for job search post-graduation. Once you get a job offer at SGD 5,000+ salary (Employment Pass) or SGD 3,000+ (S Pass), you transition to work permit. After 6 months on EP + good employer reputation, you can apply for Permanent Residence (PR). PR in Singapore opens up CPF (retirement savings), housing benefits, and stable long-term residence. Common timeline: Study (3-4 yrs) → Bond (3 yrs) → PR application (2-3 yrs) → Citizenship (3-4 more yrs).",
      },
      {
        q: "Are NUS and NTU good for Indian students?",
        a: "Excellent. Both rank top 25 globally (NUS #8, NTU #15 by QS). Strong Indian student communities (4-5k Indians at each). World-class facilities, well-known to top US/UK companies. Best fields: Computer Science, Engineering, MBA (NUS Business School / NTU Nanyang Business School), and Public Policy (Lee Kuan Yew School). Indian students often outperform Singaporean peers academically.",
      },
      {
        q: "Is Singapore safe and welcoming for Indians?",
        a: "Yes, very. Singapore is consistently ranked among the world's safest countries. 9% of Singapore's population is Indian-origin, with full cultural integration (Tamil is an official language, Deepavali is a public holiday). Indian food is everywhere (Little India + every food court). Less culture shock than going to West for the first time. Climate is warm year-round (no winter adjustment needed).",
      },
    ],
  },
];

export function getCountryBySlug(slug: string): CountryData | undefined {
  return COUNTRIES.find(c => c.slug === slug);
}
