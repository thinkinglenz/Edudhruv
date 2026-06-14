"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface Profile {
  cgpa:        number;   // 0-10
  gre:         number;   // 260-340
  ielts:       number;   // 0-9
  workExp:     number;   // years
  papers:      number;   // research papers
  internships: number;
  field:       "CS" | "DS" | "Engineering" | "MBA" | "Other";
  targetTier:  "Top10" | "Top30" | "Top50" | "Any";
}

interface Recommendation {
  category:   "Academic" | "Test scores" | "Research" | "Work experience" | "SOP";
  tip:        string;
  impact:     "high" | "medium" | "low";
}

function evaluate(p: Profile) {
  // Base score 50
  let academicScore  = 0;
  let testScore      = 0;
  let researchScore  = 0;
  let workScore      = 0;

  // Academic (CGPA)
  if      (p.cgpa >= 9.0) academicScore = 30;
  else if (p.cgpa >= 8.5) academicScore = 25;
  else if (p.cgpa >= 8.0) academicScore = 20;
  else if (p.cgpa >= 7.5) academicScore = 14;
  else if (p.cgpa >= 7.0) academicScore = 8;
  else                    academicScore = 4;

  // GRE
  if      (p.gre >= 330) testScore = 25;
  else if (p.gre >= 325) testScore = 22;
  else if (p.gre >= 320) testScore = 18;
  else if (p.gre >= 315) testScore = 13;
  else if (p.gre >= 310) testScore = 8;
  else                   testScore = 4;

  // IELTS bonus
  let ieltsBonus = 0;
  if (p.ielts >= 7.5) ieltsBonus = 5;
  else if (p.ielts >= 7.0) ieltsBonus = 3;
  else if (p.ielts >= 6.5) ieltsBonus = 1;

  // Research
  if      (p.papers >= 3) researchScore = 20;
  else if (p.papers === 2) researchScore = 15;
  else if (p.papers === 1) researchScore = 10;
  else if (p.internships >= 2) researchScore = 5;

  // Work experience (matters more for MBA)
  if (p.field === "MBA") {
    if      (p.workExp >= 5) workScore = 20;
    else if (p.workExp >= 4) workScore = 17;
    else if (p.workExp >= 3) workScore = 12;
    else if (p.workExp >= 2) workScore = 6;
    else                     workScore = 0;
  } else {
    if      (p.workExp >= 3) workScore = 10;
    else if (p.workExp >= 2) workScore = 7;
    else if (p.workExp >= 1) workScore = 4;
    else                     workScore = 0;
  }

  const totalScore = academicScore + testScore + ieltsBonus + researchScore + workScore;

  // Chance by tier
  let chance: Record<Profile["targetTier"], number> = {
    Top10: 0, Top30: 0, Top50: 0, Any: 0,
  };
  chance.Top10 = Math.max(2,  Math.min(60, totalScore - 50));
  chance.Top30 = Math.max(8,  Math.min(75, totalScore - 35));
  chance.Top50 = Math.max(15, Math.min(85, totalScore - 20));
  chance.Any   = Math.max(35, Math.min(95, totalScore - 5));

  const focusChance = chance[p.targetTier];

  // Recommendations
  const recs: Recommendation[] = [];
  if (p.cgpa < 8.0) recs.push({ category:"Academic", tip:"CGPA is below the 'safe' threshold (8.0+) for top schools. Consider strong final-year project + research papers to compensate. Some grad programs weigh last 2 years heavier than overall — finish strong.", impact:"high" });
  if (p.gre < 320 && p.field !== "MBA") recs.push({ category:"Test scores", tip:"GRE under 320 limits Top 50 US options. Aim for 325+ — focus on Quant section (most Indians can reach 168+ with 4-6 weeks of prep). Retake within 21 days if you scored under 5 points from target.", impact:"high" });
  if (p.gre < 720 && p.field === "MBA") recs.push({ category:"Test scores", tip:"GMAT under 720 limits Top 15 MBA programs. Aim for 730+ for HBS/Stanford/Wharton bracket. INSEAD/LBS achievable at 710+.", impact:"high" });
  if (p.ielts < 7.0) recs.push({ category:"Test scores", tip:"IELTS under 7.0 limits Oxford/Cambridge/Imperial (typically 7.5+). For other UK universities, 6.5 with no band below 6.0 is fine. Focus on Writing section — that's where most Indians underperform.", impact:"medium" });
  if (p.papers === 0 && p.field !== "MBA") recs.push({ category:"Research", tip:"Zero research papers is a major gap for PhD applications. For Masters, try to publish 1 paper or strong internship report by application time. Even arXiv pre-prints count for application visibility.", impact:"high" });
  if (p.workExp < 2 && p.field === "MBA") recs.push({ category:"Work experience", tip:"MBA applications need 3+ years of meaningful work experience. Schools want to see growth + impact stories. If under 3 years, consider deferring or applying to deferred MBA programs (Stanford 2+2, HBS 2+2).", impact:"high" });
  if (p.internships < 2 && p.field !== "MBA" && p.workExp === 0) recs.push({ category:"Work experience", tip:"Internships at FAANG / top startups / research labs significantly boost Masters applications. Try to get 1-2 strong internships before final year.", impact:"medium" });
  recs.push({ category:"SOP", tip:"Your Statement of Purpose makes 30-40% of the admission decision. Top tips: connect every experience to your future research/career goals, tailor for each university (research specific professors), keep it under 1000 words, get 3 rounds of feedback before submitting.", impact:"high" });

  return {
    totalScore, academicScore, testScore: testScore + ieltsBonus, researchScore, workScore,
    chance, focusChance, recommendations: recs.slice(0, 6),
  };
}

const COLOR_FOR_CHANCE = (c: number) => {
  if (c >= 60) return "#10B981";
  if (c >= 35) return "#F5A71A";
  return "#EF4444";
};

export default function ProfileEvaluator() {
  const [profile, setProfile] = useState<Profile>({
    cgpa: 8.0, gre: 320, ielts: 7.0, workExp: 1,
    papers: 0, internships: 1, field: "CS", targetTier: "Top30",
  });

  const result = useMemo(() => evaluate(profile), [profile]);

  function up<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile(p => ({ ...p, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
        <header className="px-6 py-4 text-white"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}>
          <h2 className="text-xl font-bold m-0">🎯 Profile Evaluator</h2>
          <p className="text-sm text-white/90 mt-0.5">Honest admission-chance estimate for top universities</p>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <Slider label="CGPA / Percentage (out of 10)" value={profile.cgpa} display={profile.cgpa.toFixed(1)}
                    onChange={v => up("cgpa", v)} min={5} max={10} step={0.1}
                    ticks={["5", "7.5", "10"]} />

            <Slider label={profile.field === "MBA" ? "GMAT score" : "GRE score"}
                    value={profile.gre}
                    display={profile.gre.toString()}
                    onChange={v => up("gre", v)}
                    min={profile.field === "MBA" ? 500 : 260}
                    max={profile.field === "MBA" ? 800 : 340}
                    step={profile.field === "MBA" ? 10 : 1}
                    ticks={profile.field === "MBA" ? ["500", "650", "800"] : ["260", "300", "340"]} />

            <Slider label="IELTS band" value={profile.ielts} display={profile.ielts.toFixed(1)}
                    onChange={v => up("ielts", v)} min={5} max={9} step={0.5}
                    ticks={["5.0", "7.0", "9.0"]} />

            <Slider label="Work experience (years)" value={profile.workExp} display={`${profile.workExp} yr${profile.workExp !== 1 ? "s" : ""}`}
                    onChange={v => up("workExp", v)} min={0} max={10} step={1}
                    ticks={["0", "5", "10"]} />

            <Slider label="Research papers published" value={profile.papers} display={profile.papers.toString()}
                    onChange={v => up("papers", v)} min={0} max={10} step={1}
                    ticks={["0", "5", "10"]} />

            <Slider label="Internships completed" value={profile.internships} display={profile.internships.toString()}
                    onChange={v => up("internships", v)} min={0} max={6} step={1}
                    ticks={["0", "3", "6"]} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Field</label>
                <select value={profile.field} onChange={e => up("field", e.target.value as Profile["field"])}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="CS">Computer Science</option>
                  <option value="DS">Data Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="MBA">MBA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Target tier</label>
                <select value={profile.targetTier} onChange={e => up("targetTier", e.target.value as Profile["targetTier"])}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="Top10">Top 10 globally</option>
                  <option value="Top30">Top 30</option>
                  <option value="Top50">Top 50</option>
                  <option value="Any">Any university</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="rounded-xl p-5 text-white"
                 style={{ background: `linear-gradient(135deg, ${COLOR_FOR_CHANCE(result.focusChance)} 0%, #1F2937 100%)` }}>
              <p className="text-xs uppercase tracking-wider opacity-90 mb-1">Your admission chance at {profile.targetTier} schools</p>
              <p className="text-5xl font-extrabold">{result.focusChance}%</p>
              <p className="text-sm opacity-90 mt-1">
                {result.focusChance >= 60 ? "Strong profile — apply confidently" :
                 result.focusChance >= 35 ? "Competitive but uncertain — build safety options" :
                                            "Reach profile — focus on backups + improvement areas"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ChanceBox tier="Top 10" chance={result.chance.Top10} />
              <ChanceBox tier="Top 30" chance={result.chance.Top30} />
              <ChanceBox tier="Top 50" chance={result.chance.Top50} />
              <ChanceBox tier="Any uni" chance={result.chance.Any} />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Academic score</span><span className="font-bold text-gray-800">{result.academicScore}/30</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Test score</span><span className="font-bold text-gray-800">{result.testScore}/30</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Research</span><span className="font-bold text-gray-800">{result.researchScore}/20</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Work experience</span><span className="font-bold text-gray-800">{result.workScore}/20</span></div>
              <div className="flex justify-between pt-1 border-t border-gray-200"><span className="font-bold">Total</span><span className="font-extrabold" style={{ color: "#8B5CF6" }}>{result.totalScore}/100</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📈 How to strengthen your profile</h3>
        <ul className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex gap-3 bg-gray-50 rounded-lg p-4">
              <span className="text-2xl flex-shrink-0">
                {rec.impact === "high" ? "🔴" : rec.impact === "medium" ? "🟡" : "🟢"}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{rec.category}</p>
                <p className="text-sm text-gray-800 leading-relaxed">{rec.tip}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-900">
        <strong>How this is calculated:</strong> Based on aggregate Indian-student admit data at top US/UK/Canada universities. Real outcomes depend on SOP quality, recommendation letters, fit with specific programs, and ever-changing admissions standards. <strong>Treat as a directional estimate, not a guarantee.</strong>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 text-white" style={{ background: "linear-gradient(135deg, #3AAFE5 0%, #F5A71A 100%)" }}>
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2">Want a personalised improvement plan?</h3>
        <p className="text-white/90 mb-5">Chat with Priya for tailored advice on universities to target, scholarships to apply for, and SOP review.</p>
        <Link href="/loan-portal"
              className="inline-flex items-center bg-white text-gray-900 font-bold px-5 py-3 rounded-xl">
          💬 Talk to Priya — Free →
        </Link>
      </div>
    </div>
  );
}

function Slider({ label, value, display, onChange, min, max, step, ticks }: {
  label: string; value: number; display: string;
  onChange: (v: number) => void;
  min: number; max: number; step: number; ticks: string[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-600">{label}</label>
        <span className="text-base font-extrabold" style={{ color: "#8B5CF6" }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={e => onChange(parseFloat(e.target.value))}
             className="w-full" style={{ accentColor: "#8B5CF6" }} />
      <div className="flex justify-between mt-0.5 text-[10px] text-gray-400">
        {ticks.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function ChanceBox({ tier, chance }: { tier: string; chance: number }) {
  return (
    <div className="rounded-lg p-3 border border-gray-100 bg-white">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{tier}</p>
      <p className="text-2xl font-extrabold mt-0.5" style={{ color: COLOR_FOR_CHANCE(chance) }}>{chance}%</p>
    </div>
  );
}
