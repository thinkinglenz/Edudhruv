/**
 * Print-friendly guide page — the actual content unlocked after the
 * email gate at /free-guides/100-funded-scholarships.
 *
 * No header/footer chrome around it (handled by route segment layout).
 * User hits Cmd+P / Ctrl+P → "Save as PDF" for clean PDF export.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Funded Scholarships Master List 2027 — EduDhruv",
  robots: { index: false, follow: false },  // private resource
};

interface Scholarship {
  name:        string;
  university:  string;
  amount:      string;
  deadline:    string;
  eligibility: string;
  url:         string;
}

const SCHOLARSHIPS_BY_COUNTRY: Record<string, Scholarship[]> = {
  "🇺🇸 USA": [
    { name:"Knight-Hennessy Scholars Program",     university:"Stanford University",   amount:"100% tuition + ₹25 L stipend + ₹15 L travel",
      deadline:"October 7, 2026",     eligibility:"Bachelor's < 7 yrs ago, any field, ANY Stanford grad program",
      url:"https://knight-hennessy.stanford.edu/" },
    { name:"Fulbright-Nehru Master's Fellowship",  university:"Various US universities", amount:"100% tuition + living + travel + insurance",
      deadline:"July 15, 2026",       eligibility:"Indian citizen, 3+ years work exp, age 25-35",
      url:"https://www.usief.org.in/fulbright-nehru-masters-fellowship-program/" },
    { name:"Tata Fellowship at MIT",                university:"MIT",                  amount:"100% tuition + stipend",
      deadline:"December 1, 2026",   eligibility:"Indian citizens, technology programs at MIT",
      url:"https://misti.mit.edu/tata-fellowship" },
    { name:"Cornell Tata Scholarship",              university:"Cornell University",   amount:"Up to ₹65 L/year × 4 yrs",
      deadline:"January 2, 2027",    eligibility:"Indian undergraduate students at Cornell",
      url:"https://commitment.cornell.edu/financial-aid/tata-scholarships/" },
    { name:"Inlaks Shivdasani Foundation",          university:"50+ partner universities", amount:"Up to ₹1 Cr",
      deadline:"April 15, 2027",     eligibility:"Indian citizens, age <30, top universities in US/UK/Europe",
      url:"https://www.inlaksfoundation.org/" },
    { name:"AAUW International Fellowships",        university:"Any US institution",   amount:"$18,000-$50,000 (₹15-42 L)",
      deadline:"November 15, 2026",  eligibility:"Women, full-time graduate study",
      url:"https://www.aauw.org/resources/programs/fellowships-grants/" },
    { name:"J.N. Tata Endowment Scholarship Loan", university:"Any worldwide",        amount:"Up to ₹10 L (loan + ₹1 L gift)",
      deadline:"March 31, 2027",     eligibility:"Indian citizens, top universities + courses",
      url:"https://www.jntataendowment.org/" },
  ],
  "🇬🇧 UK": [
    { name:"Rhodes Scholarship",                    university:"University of Oxford", amount:"100% tuition + ₹19 L stipend",
      deadline:"July 31, 2026",      eligibility:"Indian citizens, age 19-25, exceptional academic + leadership",
      url:"https://www.rhodesscholar.org/" },
    { name:"Clarendon Scholarship",                 university:"University of Oxford", amount:"100% tuition + ₹18 L stipend",
      deadline:"December 2, 2026 (apply via Oxford), automatic consideration",
      eligibility:"All Oxford graduate applicants — top 5% considered",
      url:"https://www.ox.ac.uk/clarendon/applying" },
    { name:"Gates Cambridge Scholarship",           university:"University of Cambridge", amount:"100% tuition + ₹19 L stipend + travel",
      deadline:"October 14, 2026",   eligibility:"Indian citizens, Cambridge grad programs, leadership focus",
      url:"https://www.gatescambridge.org/" },
    { name:"Chevening Scholarship",                 university:"Any UK university",    amount:"100% tuition + living + travel",
      deadline:"November 2, 2026",   eligibility:"Indian citizens, 2+ yrs work exp, leadership potential",
      url:"https://www.chevening.org/" },
    { name:"Commonwealth Scholarship",              university:"Any UK university",    amount:"100% tuition + ₹15 L stipend + airfare",
      deadline:"October 17, 2026",   eligibility:"Indian citizens, Master's or PhD",
      url:"https://cscuk.fcdo.gov.uk/" },
    { name:"Felix Scholarship",                     university:"Oxford / SOAS / Reading", amount:"100% tuition + living",
      deadline:"Varies by university (Dec-Jan 2027)", eligibility:"Indian citizens with First Class degree",
      url:"https://www.felixscholarship.org/" },
    { name:"Reliance Dhirubhai Fellowship (LSE)",  university:"London School of Economics", amount:"~£50,000",
      deadline:"April 2027",         eligibility:"Indian students MSc Finance / Economics at LSE",
      url:"https://www.lse.ac.uk/study-at-lse/Graduate/scholarships" },
    { name:"Cambridge Trust Scholarships",          university:"University of Cambridge", amount:"Partial to full funding",
      deadline:"Same as Cambridge application (Dec 2026)", eligibility:"All Indian applicants automatically considered",
      url:"https://www.cambridgetrust.org/" },
  ],
  "🇨🇦 Canada": [
    { name:"Vanier Canada Graduate Scholarships",   university:"Any Canadian university", amount:"CAD 50,000/yr × 3 yrs (~₹95 L total)",
      deadline:"November 1, 2026",   eligibility:"PhD students only, all fields",
      url:"https://vanier.gc.ca/" },
    { name:"McCall MacBain Scholarships",           university:"McGill University",    amount:"100% tuition + living",
      deadline:"September 24, 2026", eligibility:"Master's / Professional programs at McGill",
      url:"https://mccallmacbainscholars.org/" },
    { name:"Ontario Graduate Scholarship (OGS)",    university:"Ontario universities", amount:"CAD 15,000/yr (~₹9 L)",
      deadline:"Varies by university", eligibility:"Master's + PhD, all fields",
      url:"https://osap.gov.on.ca/" },
    { name:"University of Toronto Scholarships",     university:"University of Toronto", amount:"Up to ₹15 L/year",
      deadline:"Various (Dec 2026 - Feb 2027)", eligibility:"Merit-based, all programs",
      url:"https://future.utoronto.ca/finances/financial-aid-awards/" },
    { name:"UBC International Scholars",            university:"UBC",                  amount:"CAD 25,000-65,000/yr",
      deadline:"December 1, 2026",   eligibility:"International undergrads, leadership + academic excellence",
      url:"https://you.ubc.ca/financial-planning/awards-scholarships/" },
  ],
  "🇦🇺 Australia": [
    { name:"Australia Awards Scholarship",          university:"Any Australian uni",   amount:"100% tuition + travel + living",
      deadline:"April 30, 2027",     eligibility:"India is on eligible country list (limited Indian seats)",
      url:"https://www.dfat.gov.au/people-to-people/australia-awards" },
    { name:"Melbourne International Scholarships",  university:"University of Melbourne", amount:"100% fee remission + stipend",
      deadline:"October 31, 2026 (PhD)", eligibility:"Research candidates",
      url:"https://scholarships.unimelb.edu.au/" },
    { name:"Sydney Scholars Awards",                university:"University of Sydney", amount:"AUD 40,000/yr (~₹23 L)",
      deadline:"July 15, 2026 (Sem 1, 2027)", eligibility:"International undergrads",
      url:"https://www.sydney.edu.au/scholarships/" },
    { name:"ANU Tuition Scholarship",                university:"Australian National University", amount:"25-100% tuition remission",
      deadline:"December 15, 2026",  eligibility:"All international students automatically considered",
      url:"https://www.anu.edu.au/study/scholarships/" },
  ],
  "🇩🇪 Germany": [
    { name:"DAAD Master's Scholarship",             university:"Any German university", amount:"€934/month + tuition + travel + insurance",
      deadline:"October 31, 2026",   eligibility:"Indians with Bachelor's + 2 yrs work exp",
      url:"https://www.daad.de/en/study-and-research-in-germany/scholarships/" },
    { name:"DAAD Bi-Nationally Supervised PhD",     university:"Indian + German institute", amount:"100% + €1,200/month",
      deadline:"Varies",             eligibility:"PhD candidates, Indian + German co-supervision",
      url:"https://www.daad.de/en/study-and-research-in-germany/scholarships/" },
    { name:"Heinrich Böll Foundation Scholarship",  university:"Any German uni",       amount:"€934/month + extras",
      deadline:"March 1 / September 1, 2027", eligibility:"Master's / PhD students aligned with Green values",
      url:"https://www.boell.de/en/foundation/scholarships" },
    { name:"Deutschlandstipendium",                  university:"Most German unis",     amount:"€300/month (~₹27,000)",
      deadline:"Varies by university (typically May 2027)", eligibility:"Strong academic record",
      url:"https://www.deutschlandstipendium.de/" },
    { name:"Friedrich Ebert Foundation",            university:"Any German uni",       amount:"€934/month + extras",
      deadline:"April 30, 2027",     eligibility:"Master's students, social democratic values",
      url:"https://www.fes.de/en/studienfoerderung" },
  ],
  "🇸🇬 Singapore": [
    { name:"Tuition Grant Scheme (TGS)",            university:"NUS / NTU",            amount:"~50% tuition reduction (3-yr work bond)",
      deadline:"Automatic with admission application", eligibility:"All international students at public unis",
      url:"https://www.moe.gov.sg/financial-matters/awards-scholarships/tuition-grant" },
    { name:"NUS Reliance Dhirubhai Fellowship",    university:"NUS Business School",   amount:"100% tuition",
      deadline:"With NUS MBA application", eligibility:"Indian MBA applicants at NUS",
      url:"https://mba.nus.edu/about/scholarships" },
    { name:"Lee Kuan Yew Scholarship",              university:"NUS",                  amount:"100% tuition + S$5,000/month",
      deadline:"With program application",   eligibility:"NUS graduate programs",
      url:"https://www.nus.edu.sg/" },
    { name:"Singapore International Graduate Award",university:"Various Singapore unis", amount:"100% tuition + monthly stipend",
      deadline:"Varies",             eligibility:"PhD candidates in STEM",
      url:"https://www.a-star.edu.sg/Scholarships" },
  ],
};

const TOTAL = Object.values(SCHOLARSHIPS_BY_COUNTRY).reduce((sum, list) => sum + list.length, 0);

export default function ScholarshipsMasterListGuide() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-8 py-10 print:py-4 bg-white"
             style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <header className="mb-10 pb-6 border-b-2" style={{ borderColor: "#3AAFE5" }}>
        <div className="flex items-baseline gap-1 mb-3 print:hidden">
          <span className="text-white font-extrabold text-2xl tracking-tight" style={{ color: "#000" }}>EDU</span>
          <span className="font-extrabold text-2xl tracking-tight" style={{ color: "#3AAFE5" }}>DHRUV</span>
          <span className="text-xl ml-1" style={{ color: "#F5A71A" }}>★</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
          100% Funded Scholarships Master List 2027
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          For Indian students applying to top universities worldwide.
          <strong className="ml-1">{TOTAL} scholarships</strong> in this guide.
        </p>
        <p className="text-xs text-gray-400 mt-2 print:text-[10px]">
          Updated June 2026 · Verify deadlines on official websites before applying. · edudhruv.com
        </p>
      </header>

      {/* Intro */}
      <section className="mb-8 bg-blue-50 border-l-4 p-5 rounded-r-lg print:bg-transparent print:border-l-2"
               style={{ borderColor: "#3AAFE5" }}>
        <p className="font-bold text-gray-900 mb-2">📌 How to use this guide</p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>1. Filter by your target country (sections below)</li>
          <li>2. Apply to <strong>5-8 scholarships in parallel</strong> — Indian students typically win 1 in 6 applications</li>
          <li>3. Start <strong>14-18 months</strong> before your intended start (deadlines fall earlier than universities)</li>
          <li>4. For doubts, chat with Priya (free AI counsellor) at <strong>edudhruv.com/loan-portal</strong></li>
        </ul>
      </section>

      {/* Country sections */}
      {Object.entries(SCHOLARSHIPS_BY_COUNTRY).map(([country, list]) => (
        <section key={country} className="mb-10 print:break-inside-avoid">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1 pb-1 border-b-2" style={{ borderColor: "#F5A71A" }}>
            {country}{" "}
            <span className="text-base text-gray-500 font-medium">— {list.length} scholarships</span>
          </h2>
          <div className="space-y-4 mt-4">
            {list.map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 print:p-3 print:break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-base">{s.name}</h3>
                  <span className="text-xs font-bold text-orange-700">Deadline: {s.deadline}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">🏛️ {s.university}</p>
                <p className="text-sm text-gray-800 mb-1"><strong>💰 Amount:</strong> {s.amount}</p>
                <p className="text-sm text-gray-700 mb-2"><strong>✓ Eligibility:</strong> {s.eligibility}</p>
                <p className="text-xs text-blue-700 break-all">
                  <strong>Apply at:</strong> <a href={s.url} target="_blank" rel="noopener" className="underline">{s.url}</a>
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t-2 text-center print:break-before-avoid" style={{ borderColor: "#3AAFE5" }}>
        <p className="font-bold text-gray-900 text-lg mb-1">Found this guide useful?</p>
        <p className="text-sm text-gray-600 mb-3">
          We update this list every month. Visit <strong>edudhruv.com/scholarships</strong> for daily-updated picks.
        </p>
        <p className="text-xs text-gray-500 print:text-[10px]">
          © EduDhruv 2026 · Free for personal use · Not for commercial redistribution
        </p>
        <p className="text-xs text-gray-400 mt-2 print:hidden">
          💡 To save as PDF: Cmd+P (Mac) or Ctrl+P (Windows) → "Save as PDF"
        </p>
      </footer>
    </article>
  );
}
