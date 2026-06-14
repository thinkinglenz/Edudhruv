/**
 * Standardized test prep pages — /test-prep/{slug}
 *
 * Captures the ~200k/mo combined search volume on:
 *   "What is GRE", "GRE syllabus", "GMAT vs GRE",
 *   "IELTS Academic vs General", "TOEFL preparation"
 *
 * Each page is a Q&A-format hub targeting buyer-intent + commercial
 * queries for Indian students preparing for these tests.
 */

export const LAST_REVIEWED = "2026-06-12";

export interface TestPrep {
  slug:            string;
  test:            string;        // "GRE"
  fullName:        string;        // "Graduate Record Examinations"
  icon:            string;        // "📝"

  metaTitle:       string;
  metaDescription: string;
  intro:           string;        // 2-3 sentences

  // Quick stats (for SEO + AI extraction)
  registrationFee:    string;     // "$220 (~₹18,500)"
  durationMinutes:    number;     // 218
  maxScore:           string;     // "340 (170 V + 170 Q)"
  acceptedFor:        string;     // "Most US/Canada/Singapore Masters + PhD"
  validityYears:      string;     // "5 years"
  modes:              string[];   // ["Online (at home)", "Test center"]
  retakePolicy:       string;

  // Content sections
  whoTakes:           string;     // ~150 word paragraph

  sections: {
    name:           string;       // "Quantitative Reasoning"
    duration:       string;       // "47 minutes"
    questions:      string;       // "27 questions"
    topics:         string[];     // ["Arithmetic", "Algebra", ...]
  }[];

  scoringExplained:   string;     // ~200 word explainer

  topUniversitiesAccepted: string[];

  prepTimeline: {
    label:    string;             // "3 months — recommended"
    breakdown: { weeks: string; focus: string }[];
  };

  recommendedScores: {           // For Indian students aiming at top schools
    target:   string;             // "320+"
    section:  string;             // "Quant 165+, Verbal 155+"
    forWhat:  string;             // "Top 50 US Masters"
  }[];

  // 7-8 FAQs
  faqs: { q: string; a: string }[];
}

export const TESTS: TestPrep[] = [
  // ═══ GRE ════════════════════════════════════════════════════════════
  {
    slug: "gre",
    test: "GRE",
    fullName: "Graduate Record Examinations",
    icon: "📝",
    metaTitle: "GRE 2027: Complete Guide for Indian Students — Syllabus, Fees, Scoring",
    metaDescription: "Complete GRE guide for Indian students 2027 — exam fee $220, 1 hr 58 min duration, syllabus, scoring (130-170 V+Q), preparation timeline, target scores for top universities.",
    intro: "The GRE (Graduate Record Examinations) is the most widely-accepted standardized test for graduate school admissions worldwide — required by ~95% of US Masters/PhD programs, most Canadian + Singapore universities, and growing number of European Masters. For Indian students applying to MS programs in CS, Data Science, Engineering, or any STEM field abroad, GRE is typically your starting point.",
    registrationFee: "$220 (~₹18,500)",
    durationMinutes: 118,
    maxScore: "340 (170 Verbal + 170 Quant)",
    acceptedFor: "Masters + PhD programs in USA, Canada, Singapore, Australia, Europe",
    validityYears: "5 years",
    modes: ["Online (at home — GRE General Test at Home)", "Test center"],
    retakePolicy: "Can retake every 21 days, max 5 times in 12-month period",

    whoTakes: "Indian students applying to graduate programs (Masters or PhD) in the USA — especially in STEM fields like Computer Science, Data Science, Engineering, Statistics, and Physics. About 100,000+ Indian students take the GRE every year, making India the #1 source of GRE test-takers globally. Top US universities (MIT, Stanford, CMU, Berkeley, Cornell, Georgia Tech, etc.) traditionally required GRE — though many made it optional post-2021, strong scores still strengthen applications. GRE is also accepted by major UK universities (Oxford, Imperial College — for specific programs), Canadian universities, NUS/NTU Singapore, and many Australian institutions.",

    sections: [
      {
        name: "Analytical Writing", duration: "30 minutes", questions: "1 task (Analyze an Issue)",
        topics: ["Argumentative essay writing", "Thesis development", "Logical structure", "Evidence + examples"],
      },
      {
        name: "Verbal Reasoning", duration: "41 minutes (2 sections of 18 + 23 min)", questions: "27 questions",
        topics: ["Reading Comprehension (50%)", "Text Completion (25%)", "Sentence Equivalence (25%)", "Vocabulary heavy"],
      },
      {
        name: "Quantitative Reasoning", duration: "47 minutes (2 sections of 21 + 26 min)", questions: "27 questions",
        topics: ["Arithmetic", "Algebra", "Geometry", "Data Analysis (charts, stats)", "Calculator allowed (on-screen)"],
      },
    ],

    scoringExplained: "GRE is scored on a scale of 130-170 for each of Verbal and Quantitative sections, giving a total range of 260-340. Analytical Writing is scored separately on a 0-6 scale. Scores are sent to up to 4 schools for free (chosen on test day); additional reports cost $30 each. Score release: 8-10 days after test (online). Section-level adaptive — your performance on the first section determines difficulty of the second. For Indian Engineering students, Quant scores of 165+ are typical (>80th percentile); Verbal 155+ requires deliberate vocabulary prep. Total score 320+ is considered competitive for Top 50 US Masters; 330+ for Top 20.",

    topUniversitiesAccepted: [
      "MIT, Stanford, Harvard, CMU, UC Berkeley, Cornell, Princeton (all top US Masters require/recommend GRE)",
      "University of Toronto, UBC, McGill (Canada)",
      "NUS, NTU (Singapore — for STEM Masters)",
      "University of Melbourne, ANU (Australia — for some programs)",
      "Oxford + Imperial College London (specific Masters programs)",
    ],

    prepTimeline: {
      label: "3 months — recommended (working professionals: 4-5 months)",
      breakdown: [
        { weeks: "Weeks 1-2", focus: "Diagnostic test + understand test format + build vocabulary system (300 high-frequency words)" },
        { weeks: "Weeks 3-6", focus: "Quant fundamentals (revise high-school math + practice 500 problems) + Verbal patterns (RC + Text Completion strategies)" },
        { weeks: "Weeks 7-10", focus: "Sectional practice tests (12-15) + targeted weakness drilling + Issue task practice (write 10 essays)" },
        { weeks: "Weeks 11-12", focus: "Full-length mocks (4-5) under timed conditions + score analysis + light revision" },
      ],
    },

    recommendedScores: [
      { target: "330+", section: "Quant 168+, Verbal 162+", forWhat: "Top 10 US Masters (MIT, Stanford, CMU, Berkeley CS/ML)" },
      { target: "325+", section: "Quant 167+, Verbal 158+", forWhat: "Top 30 US Masters (Cornell, UIUC, Georgia Tech)" },
      { target: "320+", section: "Quant 165+, Verbal 155+", forWhat: "Top 50 US Masters (UT Austin, Purdue, Penn State)" },
      { target: "310+", section: "Quant 160+, Verbal 150+", forWhat: "Most state universities + research-focused PhDs (good profile compensates)" },
    ],

    faqs: [
      { q: "What is the GRE exam pattern in 2027?",
        a: "GRE General Test in 2027 has 3 sections: Analytical Writing (1 task, 30 min), Verbal Reasoning (2 sections, 41 min total, 27 questions), Quantitative Reasoning (2 sections, 47 min total, 27 questions). Total duration: 1 hour 58 minutes (shorter than the pre-2023 format). Scored 130-170 per section, with Analytical Writing scored 0-6 separately." },
      { q: "How much does GRE cost in India?",
        a: "GRE registration fee is $220 (~₹18,500 at current rates). Additional services: $30 per additional score report (free 4 included), $50 to reschedule, $50 to cancel. Test prep materials cost ₹3,000-15,000 (Manhattan, Magoosh, Princeton Review). Coaching classes (optional): ₹15,000-40,000 in India." },
      { q: "What GRE score do I need for top US Masters?",
        a: "Top 10 schools (MIT, Stanford, CMU, Berkeley, Princeton) — admitted Indians typically have 330+ (Q170, V160+). Top 30 (Cornell, UIUC, Georgia Tech, UCLA) — 325+. Top 50 (UT Austin, Purdue, Penn State) — 320+. Strong research profile + publications can offset 5-10 point GRE gap. Most US schools made GRE optional post-2021, but strong scores still differentiate Indian applicants." },
      { q: "How long should I prepare for the GRE?",
        a: "Recommended: 3 months of focused preparation (15-20 hours/week) for Indians targeting 325+. Final-year students can do 2 months. Working professionals: 4-5 months at 8-10 hours/week. Key milestones: Week 2 (first diagnostic test), Week 6 (sectional practice tests), Week 10 (full mocks), Week 12 (test). For 330+: add 2-3 weeks of vocabulary-intensive prep." },
      { q: "Is GRE easier than GMAT for Indian students?",
        a: "Depends on your strength. Engineering background: GRE Quant is easier (high-school math); GRE Verbal is harder (heavy vocabulary). Business/Liberal Arts: GMAT Verbal often easier; GMAT Quant requires data interpretation. Indian engineering students typically score relatively higher on GRE (vs GMAT) for Quant — and most US tech-focused Masters now accept either, so GRE is the safer pick for STEM applicants." },
      { q: "Can I take the GRE from home in India?",
        a: "Yes. GRE General Test at Home is available in India from 2020. Requirements: quiet private room, computer with webcam + microphone, mirror or smartphone (for room sweep), stable internet (1+ Mbps). Same fee as test center ($220). Same scoring. Most US universities accept both equally. Test slots are bookable 24/7." },
      { q: "How many times can I take the GRE?",
        a: "Up to 5 times in any 12-month rolling period, with at least 21 days between attempts. There's no lifetime cap. Schools typically see all your scores (some use the highest, some use most recent), so multiple retakes don't hurt unless scores trend down. Best practice: take it once when ready (after full mocks at target score), retake only if you score 10+ below your target." },
      { q: "Is the GRE accepted at IIM and Indian B-Schools?",
        a: "Selectively. IIM Ahmedabad, IIM Bangalore, ISB, XLRI accept GRE for select executive/PGP programs targeting international applicants. Most Indian MBA programs prefer CAT, GMAT, or XAT. For pure Masters programs at IITs/IIMs, GATE is the standard. GRE is primarily useful for international applications from India." },
    ],
  },

  // ═══ GMAT ═══════════════════════════════════════════════════════════
  {
    slug: "gmat",
    test: "GMAT",
    fullName: "Graduate Management Admission Test",
    icon: "💼",
    metaTitle: "GMAT 2027: Complete Guide for Indian Students — Syllabus, Fees, MBA Scores",
    metaDescription: "GMAT 2027 complete guide for Indian students — exam fee $275, 2hr 15min duration, GMAT Focus Edition format, scoring 205-805, target scores for Harvard/Stanford/INSEAD MBA.",
    intro: "The GMAT (Graduate Management Admission Test) is the gold standard for MBA admissions globally — required by virtually every top MBA program (Harvard, Stanford GSB, Wharton, INSEAD, LBS, ISB). For Indian students aiming at international MBA, GMAT is your primary differentiator alongside work experience.",
    registrationFee: "$275 (~₹23,000)",
    durationMinutes: 135,
    maxScore: "805 (GMAT Focus Edition — 2024 onwards)",
    acceptedFor: "MBA programs worldwide + select Masters in Management programs",
    validityYears: "5 years",
    modes: ["Online (GMAT Online)", "Test center"],
    retakePolicy: "Once every 16 days, max 5 attempts in 12 months, max 8 lifetime",

    whoTakes: "Indian MBA aspirants targeting international programs — primarily at top US schools (Harvard, Stanford, Wharton, Booth, MIT Sloan, Kellogg, Columbia), top European programs (INSEAD, LBS, IESE, IE), and top Asian programs (NUS, NTU, INSEAD Asia, HKUST, ISB). Approximately 35,000+ Indians take the GMAT annually — India is the second-largest test market after USA. Indian applicants are the most competitive global cohort: median GMAT for Indian admits at top schools is typically 730+, vs global median of 720.",

    sections: [
      {
        name: "Quantitative Reasoning", duration: "45 minutes", questions: "21 questions",
        topics: ["Problem Solving", "Arithmetic + Algebra", "Geometry", "Statistics", "Calculator NOT allowed"],
      },
      {
        name: "Verbal Reasoning", duration: "45 minutes", questions: "23 questions",
        topics: ["Reading Comprehension", "Critical Reasoning", "Heavier on logic than vocabulary"],
      },
      {
        name: "Data Insights (new in Focus Edition)", duration: "45 minutes", questions: "20 questions",
        topics: ["Data Sufficiency", "Multi-source Reasoning", "Graphics Interpretation", "Two-part Analysis", "Table Analysis"],
      },
    ],

    scoringExplained: "GMAT Focus Edition (since 2024) is scored on 205-805 scale. Each section (Quant, Verbal, Data Insights) is scored 60-90, combined into total. Schools typically focus on total score; some emphasize Quant (for finance, consulting). Score release: official scores ready in 3-5 days (online) or 20 days (test center). Schools see all scores from past 5 years by default; you can choose which to send. Indian engineering students typically score Quant 85+ (>90th percentile); Verbal 80+ is where strategy matters most. Total 700+ is competitive for top schools; 730+ is the bar for HBS/Stanford GSB.",

    topUniversitiesAccepted: [
      "Harvard Business School, Stanford GSB, Wharton, MIT Sloan, Booth, Kellogg, Columbia (all top US MBAs)",
      "INSEAD (France/Singapore), London Business School, Said Oxford, Judge Cambridge",
      "ISB Hyderabad/Mohali, IIM Ahmedabad (PGPX), IIM Bangalore (EPGP)",
      "HKUST, CEIBS (China), NUS Singapore, NTU Singapore",
      "IESE, IE Business School (Spain)",
    ],

    prepTimeline: {
      label: "3-4 months — recommended (full-time prep) | 5-6 months — working professionals",
      breakdown: [
        { weeks: "Weeks 1-3", focus: "Diagnostic mock + understand Focus Edition format + Quant fundamentals + start question banks" },
        { weeks: "Weeks 4-8", focus: "Sectional drills (1500+ Quant problems, 800+ Verbal/Data Insights) + concept mastery" },
        { weeks: "Weeks 9-12", focus: "10-12 full-length mocks + score analysis + targeted weak-area drilling" },
        { weeks: "Weeks 13-14", focus: "Last 3-4 mocks (one every 3 days) + light revision + mental prep" },
      ],
    },

    recommendedScores: [
      { target: "740+", section: "Quant 88+, Verbal 84+, Data Insights 85+", forWhat: "HBS, Stanford GSB, Wharton (top 5 US MBAs)" },
      { target: "720+", section: "Quant 86+, Verbal 80+, Data Insights 82+", forWhat: "Top 10 US MBAs (Booth, Kellogg, Columbia, MIT Sloan)" },
      { target: "700+", section: "Quant 84+, Verbal 78+, Data Insights 80+", forWhat: "INSEAD, LBS, IESE, ISB, Tuck, Yale" },
      { target: "680+", section: "Quant 82+, Verbal 74+, Data Insights 76+", forWhat: "IIM PGPX, top Asian MBAs, mid-tier US MBAs (compelling story needed)" },
    ],

    faqs: [
      { q: "What is the new GMAT Focus Edition (2024 onwards)?",
        a: "GMAT Focus Edition replaced the classic GMAT in early 2024. Changes: shorter duration (2 hr 15 min vs 3 hr 7 min), 3 sections (Quant, Verbal, Data Insights — no separate Analytical Writing or IR), new scale 205-805 (not 200-800), score breakdown sent to schools includes section + total. The Focus Edition is what all 2024+ applicants will take. Pre-2024 GMAT scores are still valid for 5 years post-test." },
      { q: "How much does GMAT cost in India?",
        a: "GMAT registration: $275 (~₹23,000) — same for online and test center. Additional services: $50 per score report after 5 free, $50 to reschedule. Prep materials: OG (Official Guide) $50, MBA.com Prep Plus $30, Manhattan books ₹4,000-8,000. Coaching (optional): GMAT classes in India ₹25,000-60,000; online platforms like Target Test Prep, e-GMAT around $200-500. Total realistic prep budget for Indians: ₹50,000-1 L." },
      { q: "What GMAT score do I need for HBS / Stanford / Wharton?",
        a: "Indian admits at HBS: median GMAT 730, range 700-770. Stanford GSB: median 738, range 710-780. Wharton: median 732. For Indian engineer demographic (most competitive applicant pool), aim for 740+ to be 'average' admit. Strong work experience (4-6 years), unique leadership impact stories, and standout essays can offset slightly lower GMAT (down to 710). Don't apply to top 5 with sub-700." },
      { q: "Should I take GMAT or GRE for MBA?",
        a: "Most top MBAs now accept both — including HBS, Stanford GSB, Wharton, Booth, Kellogg, INSEAD, LBS, ISB. GMAT is still the 'default' (90%+ of MBA applicants take it). GRE is acceptable if you're also considering Masters programs alongside MBA. Differences: GMAT Quant has Data Sufficiency (logic-heavy); GRE Quant is more straightforward math. GMAT Verbal has heavier logic; GRE Verbal is heavier on vocabulary. For pure MBA applicants: GMAT slightly preferred. For dual-track (MBA + Masters): GRE works for both." },
      { q: "How long is the GMAT valid in 2027?",
        a: "GMAT scores are valid for 5 years from your test date. Test taken in 2022 → valid until 2027 for applications. Most top MBAs accept scores within this window without question. After 5 years, you'd need to retake. Practical advice for Indian applicants: take GMAT 2-3 years before your target MBA application year (gives you time to retake if needed, scores stay valid through application cycle)." },
      { q: "Can I take GMAT online from India?",
        a: "Yes. GMAT Online is available worldwide, including India, since 2020. Requirements: quiet room, desktop/laptop with webcam (no tablets), Windows 10/11 or Mac OS 11+, 1 Mbps+ internet. You can use scratch paper (specific format) and on-screen calculator for Data Insights. Score is reported same day for online (preview), official in 3-5 days. Most MBAs accept online and test center scores equally." },
      { q: "How many times can I take the GMAT?",
        a: "Up to 5 attempts in any 12-month rolling period, with at least 16 days between attempts. Lifetime maximum: 8 attempts. Schools see your full GMAT score history by default (you can't hide retakes). Best practice: take when ready (after consistent practice tests at target score), retake only if scored 30+ below target. Multiple retakes don't significantly hurt — schools usually focus on highest score." },
      { q: "Is GMAT required for ISB and IIM PGPX?",
        a: "ISB: GMAT mandatory (GRE also accepted). Average ISB admit GMAT: 715. IIM Ahmedabad PGPX (1-year MBA): GMAT mandatory, average 705. IIM Bangalore EPGP: GMAT required, average 695. For traditional 2-year IIM MBA programs (PGP at IIM A/B/C): no GMAT — CAT required instead. Indian executives applying to international 1-year MBAs typically take GMAT alongside CAT." },
    ],
  },

  // ═══ IELTS ══════════════════════════════════════════════════════════
  {
    slug: "ielts",
    test: "IELTS",
    fullName: "International English Language Testing System",
    icon: "🗣️",
    metaTitle: "IELTS 2027 for Indian Students: Academic vs General, Scoring, Target Bands",
    metaDescription: "IELTS 2027 complete guide for Indian students — exam fee ₹17,000, IELTS Academic vs General Training, scoring 0-9 band, target bands for UK/Canada/Australia/USA universities.",
    intro: "IELTS (International English Language Testing System) is the most widely-accepted English proficiency test for studying or working abroad. For Indian students, IELTS Academic is required for: UK/Australia/Canada/New Zealand universities (mandatory), most European universities, growing number of US universities, and visa processing for Canada/UK/Australia.",
    registrationFee: "₹17,000 (~$200)",
    durationMinutes: 165,
    maxScore: "9.0 band (overall, with sub-bands for each skill)",
    acceptedFor: "Universities in UK, Australia, Canada, New Zealand, USA, Ireland + visa for these countries",
    validityYears: "2 years",
    modes: ["Computer-delivered IELTS", "Paper-based IELTS", "IELTS Online (limited countries)"],
    retakePolicy: "No cooldown — retake anytime (recommended: wait 2-3 weeks for prep)",

    whoTakes: "Indian students applying to universities or skilled migration in English-speaking countries (UK, Australia, Canada, New Zealand, Ireland). About 1 million+ Indians take IELTS every year — India is the #1 IELTS test market globally. Two versions exist: IELTS Academic (for university admissions + professional registration) and IELTS General Training (for skilled migration + work visa). For study abroad, Academic version is required. UK Student Visa requires IELTS UKVI Academic (slightly stricter conditions, same scoring). Canada SDS (Student Direct Stream) requires IELTS Academic 6.0+ overall (with no band below 6.0).",

    sections: [
      {
        name: "Listening", duration: "30 minutes + 10 min transfer (paper) / built-in (computer)", questions: "40 questions across 4 sections",
        topics: ["Everyday conversations (Section 1)", "Monologue social context (Section 2)", "Academic discussion (Section 3)", "Academic lecture (Section 4)"],
      },
      {
        name: "Reading (Academic)", duration: "60 minutes", questions: "40 questions across 3 long passages",
        topics: ["Academic articles (humanities, sciences)", "True/False/Not Given", "Matching headings", "Multiple choice", "Sentence completion"],
      },
      {
        name: "Writing (Academic)", duration: "60 minutes", questions: "2 tasks",
        topics: ["Task 1 (20 min): Describe graph/chart/diagram in 150+ words", "Task 2 (40 min): Argumentative essay 250+ words", "Task 2 carries 2x weight of Task 1"],
      },
      {
        name: "Speaking", duration: "11-14 minutes (with examiner, in-person or video call)", questions: "3 parts",
        topics: ["Part 1 (4-5 min): Personal questions about home/work/hobbies", "Part 2 (3-4 min): 2-minute talk on given topic with 1 min prep", "Part 3 (4-5 min): Abstract discussion of Part 2 topic"],
      },
    ],

    scoringExplained: "IELTS scores each skill (Listening, Reading, Writing, Speaking) on a 0-9 band scale in half-band increments (0, 0.5, 1.0, 1.5,…, 9.0). The Overall Band Score is the average of all 4 skills, rounded to the nearest 0.5 or whole band. Band 9 = expert user; 8 = very good; 7 = good; 6.5 = competent for most university admissions; 6 = competent; 5.5 = modest. Results released in 13 days (paper) or 3-5 days (computer). Most UK universities require 6.5 overall (no band below 6.0); Russell Group prefers 7.0+. Canada SDS visa requires 6.0+ overall. Australia universities: 6.5+. US universities increasingly accepting IELTS: 7.0+ for top programs.",

    topUniversitiesAccepted: [
      "All UK universities (Oxford, Cambridge, Imperial, UCL, LSE, etc.)",
      "All Australian universities (Melbourne, Sydney, ANU, UNSW, Monash)",
      "All Canadian universities (Toronto, UBC, McGill, Waterloo, Alberta)",
      "Most US universities (Harvard, Stanford, MIT increasingly accept IELTS — verify per program)",
      "European universities (TU Munich, ETH Zurich, KU Leuven for English programs)",
      "Required for Canadian SDS visa, UK Student Visa, Australian Student Visa",
    ],

    prepTimeline: {
      label: "6-8 weeks — recommended for Indians with English-medium education",
      breakdown: [
        { weeks: "Week 1", focus: "Diagnostic test (free Cambridge IELTS practice book) + understand band descriptors + identify weak skill" },
        { weeks: "Weeks 2-3", focus: "Listening + Reading intensive (Cambridge IELTS books 14-18) + Writing Task 1 templates" },
        { weeks: "Weeks 4-5", focus: "Writing Task 2 (15-20 practice essays with feedback) + Speaking Part 1+2 (record yourself, refine fluency)" },
        { weeks: "Weeks 6-7", focus: "Full mock tests (4-5) + Speaking mocks with English-speaking partner + targeted weak-area drilling" },
        { weeks: "Week 8", focus: "Final 2 mocks + last 3 days light revision (no new content)" },
      ],
    },

    recommendedScores: [
      { target: "7.5+ overall", section: "L/R 8.0+, W/S 7.0+", forWhat: "Oxford, Cambridge, Imperial (high-competition Masters)" },
      { target: "7.0+ overall", section: "L/R 7.5+, W/S 6.5+", forWhat: "Most UK Russell Group + top US universities accepting IELTS" },
      { target: "6.5+ overall (no band <6.0)", section: "All bands 6.0+", forWhat: "Most UK/Australia/Canada universities (standard requirement)" },
      { target: "6.0+ overall", section: "All bands 6.0+", forWhat: "Canada SDS visa, minimum for many international universities" },
    ],

    faqs: [
      { q: "What is the difference between IELTS Academic and IELTS General Training?",
        a: "IELTS Academic: for university admissions + professional registration. Reading and Writing sections feature academic content (essays, graph analysis). Listening + Speaking are same as General. IELTS General Training: for migration to UK/Canada/Australia/NZ + work permits. Reading uses workplace + community content; Writing tasks are letter writing + general essay. For Indian students studying abroad, ALWAYS take IELTS Academic. General is for permanent migration via skilled visa programs." },
      { q: "How much does IELTS cost in India in 2027?",
        a: "IELTS test fee: ₹17,000 (computer-delivered or paper-based, IDP or British Council). IELTS UKVI Academic: ₹17,800 (for UK Student Visa). IELTS Life Skills A1/B1: ₹15,800 (UK spouse/work visas only). Prep materials: Cambridge IELTS books (5-18) at ₹500-800 each. Coaching (optional): ₹8,000-25,000 in India. Realistic budget: ₹20,000-30,000 total including coaching." },
      { q: "What IELTS score do I need for UK student visa?",
        a: "UK Student Visa (Tier 4/Student Route): minimum CEFR B2 level = IELTS UKVI 5.5 (with all bands 5.5+) for degree programs, IELTS UKVI 4.0 for pre-sessional courses. BUT most universities require higher: Russell Group typically 6.5+ overall (no band below 6.0); Oxford/Cambridge often 7.5+. UK Student Visa accepts IELTS UKVI only (NOT regular IELTS) for visa application — though universities may accept regular IELTS for admissions." },
      { q: "How long is IELTS valid?",
        a: "IELTS scores are valid for 2 years from the test date. After 2 years, you'd need to retake — universities and visa authorities will reject older scores. For Indian students: plan test 6-18 months before your intended start. Don't take it too early (validity expires) or too late (no buffer for retakes)." },
      { q: "Can I take IELTS multiple times?",
        a: "Yes — unlimited times, no waiting period required (recommend 2-3 weeks for additional prep). You can choose which score to submit (universities don't see history). Best practice: take it once when consistently scoring at target in mocks. Retake only if you score 0.5 band below target. Indian students typically don't need more than 2 attempts." },
      { q: "What is a good IELTS score for Indian students?",
        a: "7.0+ overall is considered strong (top 30% of test takers). 6.5+ overall is solid (top 50%). 6.0 is the bare minimum for most uses. Indian English-medium school students typically score: Listening 7.5+ (easiest), Reading 7.0+ (manageable), Writing 6.0-6.5 (hardest section for Indians), Speaking 6.5-7.0 (depends on fluency). Focus prep on Writing — it's where most Indians under-perform vs target." },
      { q: "IELTS vs TOEFL — which is better for Indian students?",
        a: "Choose based on destination. IELTS: better for UK, Australia, Canada, New Zealand (preferred or only accepted), required for visas. TOEFL: better for USA universities (slight preference historically). Both: accepted by Singapore, Europe, and increasingly USA. Indian students typically find IELTS Speaking easier (in-person conversation vs TOEFL's recorded responses). IELTS Listening uses British + Australian + Indian accents (familiar); TOEFL uses American only. For multi-country applications, take IELTS — wider acceptance globally." },
      { q: "Is IELTS Online accepted by universities?",
        a: "IELTS Online (taken at home) is available in select countries (NOT yet in India as of 2026). For Indian students, you take computer-delivered or paper IELTS at IDP/British Council test centers. Computer-delivered IELTS (results in 3-5 days) is preferred over paper-based (13 days) for faster turnaround. Both are equally accepted by universities + visa authorities — no difference in scoring or validity." },
    ],
  },
];

export function getTestBySlug(slug: string): TestPrep | undefined {
  return TESTS.find(t => t.slug === slug);
}

export function getAllTestSlugs(): string[] {
  return TESTS.map(t => t.slug);
}
