"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type Intake = "fall-2027" | "spring-2027" | "fall-2028" | "spring-2028";
type Country = "USA" | "UK" | "Canada" | "Australia" | "Germany" | "Singapore";
type Level   = "Masters" | "MBA" | "PhD" | "Bachelors";

interface Milestone {
  monthsBeforeIntake: number;     // negative = before, 0 = month of intake
  title:    string;
  detail:   string;
  category: "test" | "research" | "application" | "funding" | "visa" | "travel";
  urgency:  "high" | "medium" | "low";
}

// ─── MILESTONE TEMPLATES BY LEVEL ────────────────────────────────────
function buildMilestones(country: Country, level: Level): Milestone[] {
  const list: Milestone[] = [
    { monthsBeforeIntake: 16, title: "Research universities + shortlist 8-12", detail: "Use our shortlisting quiz + university detail pages. Pick 2 dream / 4 target / 4 safe schools.", category: "research", urgency: "high" },
    { monthsBeforeIntake: 15, title: "Take diagnostic test (GRE/GMAT/IELTS)", detail: "Free mock from Cambridge/ETS. Know your baseline before serious prep.", category: "test", urgency: "high" },
    { monthsBeforeIntake: 14, title: "Begin standardized test prep", detail: level === "MBA" ? "GMAT/GRE for 3-4 months" : "GRE for 2-3 months", category: "test", urgency: "high" },
    { monthsBeforeIntake: 12, title: "Take IELTS / TOEFL", detail: "Most Indians need 6-8 weeks prep. Take at least 12 months before intake to allow retake buffer.", category: "test", urgency: "high" },
    { monthsBeforeIntake: 11, title: "Take GRE / GMAT", detail: "Allow buffer of 1-2 months for potential retake.", category: "test", urgency: "high" },
    { monthsBeforeIntake: 10, title: "Identify recommenders + start essays", detail: "Ask 3 professors / managers 9 months before deadline. Draft your first SOP/essay.", category: "application", urgency: "high" },
    { monthsBeforeIntake: 9,  title: "Apply to scholarships (Rhodes, Knight-Hennessy, Gates)", detail: "Major scholarships have deadlines 4-6 months BEFORE university deadlines. Don't miss them.", category: "funding", urgency: "high" },
    { monthsBeforeIntake: 8,  title: "Finalize university list + create application tracker", detail: "Spreadsheet with deadlines, requirements, fee, status. Mark on calendar.", category: "application", urgency: "medium" },
    { monthsBeforeIntake: 7,  title: "Polish SOPs + get recommenders to submit drafts", detail: "Tailor each SOP per university — generic SOPs are the #1 reason for rejection.", category: "application", urgency: "high" },
    { monthsBeforeIntake: 6,  title: "Submit first round of applications", detail: country === "USA" ? "Top US programs have December deadlines" : country === "UK" ? "Many UK programs use rolling — apply early" : "First round priority deadlines", category: "application", urgency: "high" },
    { monthsBeforeIntake: 5,  title: "Submit remaining applications", detail: "Don't wait for round 2 — early submissions get more scholarship consideration.", category: "application", urgency: "high" },
    { monthsBeforeIntake: 4,  title: "Apply for education loan in parallel", detail: "Compare HDFC Credila, SBI, Prodigy. Get pre-approval to strengthen visa application.", category: "funding", urgency: "medium" },
    { monthsBeforeIntake: 3,  title: "Receive admit decisions + accept offer", detail: "Compare offers carefully — funding, university brand, program fit. Pay enrollment deposit.", category: "application", urgency: "high" },
    { monthsBeforeIntake: 2,  title: "Apply for student visa", detail: country === "USA" ? "F-1 visa: get I-20, pay SEVIS, book interview" : country === "UK" ? "Tier 4: CAS letter, blocked funds, TB test" : country === "Canada" ? "Study Permit via SDS (fastest) or regular" : country === "Germany" ? "National Student Visa + Blocked Account €11,904" : "Subclass 500 / Student Pass", category: "visa", urgency: "high" },
    { monthsBeforeIntake: 1,  title: "Book flights + arrange initial accommodation", detail: "Book 2-3 weeks of temporary housing — find permanent rental after arrival.", category: "travel", urgency: "medium" },
    { monthsBeforeIntake: 1,  title: "Pre-departure: forex, SIM, insurance", detail: "Get multi-currency travel card, international SIM/eSIM, mandatory health insurance.", category: "travel", urgency: "medium" },
    { monthsBeforeIntake: 0,  title: "Departure + arrive 2 weeks before classes", detail: "Buffer time for orientation, banking, residence permit registration (Germany).", category: "travel", urgency: "high" },
  ];
  return list;
}

const INTAKES: { id: Intake; label: string; intakeMonth: number; intakeYear: number }[] = [
  { id: "fall-2027",   label: "Fall 2027 (Aug-Sep)",     intakeMonth: 9, intakeYear: 2027 },
  { id: "spring-2028", label: "Spring 2028 (Jan-Feb)",   intakeMonth: 1, intakeYear: 2028 },
  { id: "fall-2028",   label: "Fall 2028 (Aug-Sep)",     intakeMonth: 9, intakeYear: 2028 },
  { id: "spring-2027", label: "Spring 2027 (Jan-Feb)",   intakeMonth: 1, intakeYear: 2027 },
];

const CATEGORY_COLORS: Record<Milestone["category"], { bg: string; text: string; icon: string }> = {
  test:        { bg:"#FEF3C7", text:"#B45309", icon:"📝" },
  research:    { bg:"#DBEAFE", text:"#1E40AF", icon:"🔍" },
  application: { bg:"#FCE7F3", text:"#9D174D", icon:"📄" },
  funding:     { bg:"#D1FAE5", text:"#065F46", icon:"💰" },
  visa:        { bg:"#FEE2E2", text:"#991B1B", icon:"📘" },
  travel:      { bg:"#E0E7FF", text:"#3730A3", icon:"✈️" },
};

export default function ApplicationTimeline() {
  const [intake, setIntake]   = useState<Intake>("fall-2027");
  const [country, setCountry] = useState<Country>("USA");
  const [level, setLevel]     = useState<Level>("Masters");

  const intakeInfo = INTAKES.find(i => i.id === intake)!;
  const milestones = useMemo(() => buildMilestones(country, level), [country, level]);

  // Calculate calendar date for each milestone
  const datedMilestones = useMemo(() => {
    return milestones.map(m => {
      const monthsBack = m.monthsBeforeIntake;
      const targetMonth = intakeInfo.intakeMonth - monthsBack;
      const date = new Date(intakeInfo.intakeYear, targetMonth - 1, 15);
      return {
        ...m,
        date,
        dateLabel: date.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
        isPast: date.getTime() < Date.now(),
      };
    });
  }, [milestones, intakeInfo]);

  // Group milestones by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof datedMilestones> = {};
    for (const m of datedMilestones) {
      const key = m.dateLabel;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    }
    return groups;
  }, [datedMilestones]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <header className="px-6 py-4 text-white"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}>
          <h2 className="text-xl font-bold m-0">📅 Application Timeline Builder</h2>
          <p className="text-sm text-white/90 mt-0.5">Personalised month-by-month checklist for your intake</p>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target intake</label>
            <select value={intake} onChange={e => setIntake(e.target.value as Intake)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm">
              {INTAKES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
            <select value={country} onChange={e => setCountry(e.target.value as Country)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm">
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="Germany">🇩🇪 Germany</option>
              <option value="Singapore">🇸🇬 Singapore</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Degree level</label>
            <select value={level} onChange={e => setLevel(e.target.value as Level)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm">
              <option value="Masters">Master's</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
              <option value="Bachelors">Bachelor's</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-5">
        {Object.entries(groupedByDate).map(([date, items], idx) => {
          const isPast = items[0].isPast;
          return (
            <div key={date} className={`relative pl-12 ${isPast ? "opacity-50" : ""}`}>
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
              <div className="absolute left-[-9px] top-2 w-5 h-5 rounded-full border-4 border-white"
                   style={{ background: isPast ? "#9CA3AF" : "#8B5CF6" }} />

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base">{date}</h3>
                  <span className="text-xs text-gray-500">
                    {items[0].monthsBeforeIntake === 0
                      ? "🎯 Intake month!"
                      : `${items[0].monthsBeforeIntake} months before intake`}
                  </span>
                </div>

                <ul className="space-y-3">
                  {items.map((m, j) => {
                    const cat = CATEGORY_COLORS[m.category];
                    return (
                      <li key={j} className="flex gap-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                              style={{ background: cat.bg }}>
                          {cat.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap mb-1">
                            <p className="font-bold text-gray-900 text-sm">{m.title}</p>
                            {m.urgency === "high" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                    style={{ background: "#FEE2E2", color: "#991B1B" }}>
                                Critical
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{m.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 sm:p-8 text-white" style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2">Need help with any of these steps?</h3>
        <p className="text-white/90 mb-5">Priya (free AI counsellor) can guide you through SOPs, scholarship picks, loan options, and more.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/loan-portal"
                className="inline-flex items-center justify-center bg-white text-gray-900 font-bold px-5 py-3 rounded-xl">
            💬 Talk to Priya — Free
          </Link>
          <Link href="/best-education-loans"
                className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-5 py-3 rounded-xl">
            💰 Compare Education Loans
          </Link>
        </div>
      </div>
    </div>
  );
}
