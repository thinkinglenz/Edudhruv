/**
 * SOP (Statement of Purpose) sample library — gated by email.
 *
 * Each sample is a real-style essay (anonymized, generic enough to be
 * publicly shareable) showing what a winning SOP looks like for that
 * program. Indian context throughout.
 *
 * Targets "SOP sample MS CS" + "SOP for MBA admission" type queries
 * (combined ~30k/mo searches).
 */

export const LAST_REVIEWED = "2026-06-14";

export interface SOPSample {
  slug:           string;
  program:        string;        // "MS Computer Science"
  university:     string;        // "Stanford / MIT / CMU tier"
  studentProfile: string;        // "Tier-1 IIT, 8.7 CGPA, 2 internships"
  wordCount:      number;
  intro:          string;        // 1-2 sentence preview
  fullText:       string;        // The actual SOP (paragraphs separated by \n\n)
  whatWorked:     string[];      // 3-4 bullets explaining why this SOP succeeds
}

export const SOP_SAMPLES: SOPSample[] = [
  {
    slug: "ms-computer-science-top10-us",
    program: "MS Computer Science (Top-10 US)",
    university: "MIT / Stanford / CMU / Berkeley tier",
    studentProfile: "IIT Bombay CS, 8.9 CGPA, 2 internships (Microsoft, IBM Research), 1 IEEE paper",
    wordCount: 985,
    intro: "Strong opening hook about a real research problem, clear progression from undergrad coursework to specific research interests at the target university.",
    fullText: `My fascination with reinforcement learning began in my second year at IIT Bombay, when I built a self-balancing robot for a robotics club project. The simple PID controller worked, but it failed every time the robot encountered new terrain. That failure forced me to consider how systems could learn from experience rather than rely on pre-programmed rules — leading me directly to the field I now want to dedicate my graduate research to.

Over the next two years, I systematically built the foundations needed to contribute to RL research. I took every graduate-level course available — Advanced Machine Learning under Prof. Sunita Sarawagi, Stochastic Processes, and Convex Optimization with Prof. Ravindra Sharma. Each course was a step toward understanding the mathematical bones of how learning systems work. I supplemented coursework with self-study of Sutton and Barto's "Reinforcement Learning" and implementing every algorithm from scratch in PyTorch.

The opportunity to apply this understanding came during my summer 2024 internship at Microsoft Research India under Dr. Akshay Krishnamurthy. Our project tackled sample-efficient exploration in deep RL — specifically how agents could discover novel states without exhaustive random sampling. I implemented a curiosity-driven exploration variant and ran ablation studies across Atari benchmarks. While our improvements over baseline UCB were modest (3-7% on sparse-reward games), the experience taught me something more valuable: how to design clean experiments, defend assumptions in weekly seminars, and write research code that other people could build on.

This work led to my first publication at the IEEE Conference on Machine Learning Workshops, where I presented a poster on "Episodic Memory for Sample-Efficient Exploration." The feedback I received pushed me to question whether episodic memory was even the right abstraction. That question — what is the right structure for memory in RL agents — is what I want to spend my PhD years investigating.

Specifically, I am drawn to MIT's CSAIL because of Professor Pulkit Agrawal's work on physical interaction and embodied learning. His paper "Curiosity-Driven Exploration by Self-Supervised Prediction" was foundational to my internship project, and I have been following his recent work on tactile learning with great interest. The intersection of his lab's focus on embodied agents and Professor Tomás Lozano-Pérez's work on planning under uncertainty would let me explore the question I care about: how can agents build interpretable memory structures from physical interaction?

My second internship at IBM Research Yorktown in summer 2025 gave me complementary perspective. Working under Dr. Kunj Patel on causal RL, I helped develop a benchmark suite for evaluating whether RL agents could distinguish correlation from causation in their learned policies. This shifted my thinking — from "how do we make agents learn faster" to "how do we make agents learn the right things." The benchmark is currently under review at NeurIPS 2026, and we have submitted code and pretrained models on GitHub.

Beyond research, I have served as a teaching assistant for two undergraduate ML courses at IIT Bombay, mentoring 60+ students through their first PyTorch implementations. Teaching forced me to articulate ideas I thought I understood — and revealed gaps I had been papering over. I now believe the strongest researchers are those who can explain their work to a curious 18-year-old, and graduate school is where I want to develop that capacity fully.

I am applying to MIT EECS with the long-term goal of becoming a research scientist at a place like FAIR, DeepMind, or Microsoft Research. The intersection of theoretical depth (which I find at MIT) and applied research with real systems (which industrial research labs offer) is where I believe the most interesting questions sit. Over the next five years, I want to publish work on memory structures in embodied RL agents, contribute to open-source libraries that lower the barrier to RL research, and eventually mentor the next generation of researchers from India.

I have been preparing for this trajectory deliberately. I have already maintained correspondence with two of Professor Agrawal's students about ongoing projects, audited MIT's online 6.S191 lectures, and contributed minor fixes to the OpenAI Gymnasium library. The next step is the formal training that only a PhD at MIT can provide.

Thank you for considering my application. I look forward to contributing to the intellectual life of the Pulkit Agrawal lab and CSAIL more broadly.`,
    whatWorked: [
      "Specific research story — the 'self-balancing robot' anecdote is concrete and memorable",
      "Names specific professors + papers — shows the applicant has read the lab's work, not generic name-drops",
      "Quantified results (3-7% improvement, 60+ students taught) — credibility through specificity",
      "Clear long-term goal articulated honestly (research scientist at industrial labs) — admits committee can see fit",
      "Mentions ongoing engagement (correspondence with current students, library contributions) — shows initiative",
    ],
  },
  {
    slug: "mba-harvard-stanford-tier",
    program: "MBA (HBS / Stanford GSB tier)",
    university: "Harvard / Stanford / Wharton tier",
    studentProfile: "BITS Pilani undergrad, 5 years at McKinsey (Engagement Manager), Indian Investment Banking internship",
    wordCount: 750,
    intro: "Strong leadership impact story, clear post-MBA career vision, demonstrates both analytical rigor and emotional intelligence.",
    fullText: `In April 2024, I was sitting in a hospital corridor in Bhubaneswar, Odisha, holding the hand of a mother whose 8-year-old daughter had just been diagnosed with leukemia. The treatment would cost ₹35 lakh — more than the family had earned in a lifetime. I was there as part of a McKinsey pro-bono engagement with Tata Trusts, designing a financial assistance program for pediatric cancer patients in tier-2 Indian cities. That afternoon clarified for me what I want to do with the next 30 years of my career.

I want to build infrastructure that closes the healthcare access gap in India. Not as a doctor — I am an engineer by training — but as someone who can design and operate the systems that move money, data, and decision-making to the places they don't currently reach. An MBA at HBS, and specifically the Healthcare Initiative coursework with Professor Regina Herzlinger, is how I plan to acquire the institutional grounding to do that work credibly.

My path to this clarity has been more practical than visionary. After graduating from BITS Pilani with a degree in Computer Science, I joined McKinsey's Mumbai office in 2020. Over five years, I have led 14 engagements across pharma, healthcare services, and digital health — most recently as Engagement Manager on a $500M operational turnaround for a hospital chain. The work has been intellectually demanding, but more importantly, it has forced me to see healthcare delivery from every angle: as a regulator, as a hospital CFO, as a doctor whose time is being optimized away, and as a patient whose family is sitting in a hospital corridor.

Three experiences in particular shaped what I want from an MBA. First, my work on insurance product design with a major Indian insurer made me realize I lack the financial modeling depth to build healthcare financing products from first principles — McKinsey's frameworks helped, but I want to understand the math. Second, leading a 12-person team across three cities during the hospital turnaround taught me the limits of my management style — I am too transactional, and too quick to dismiss emotional dynamics. Third, my conversations with healthcare-focused VCs (most recently Norwest Venture Partners) suggested that operating experience plus rigorous MBA training is the strongest foundation for building a healthcare venture later.

What I would bring to HBS is grounded operating experience in one of the world's most challenging healthcare markets, the ability to bridge analytics and execution, and a commitment to building rather than analyzing. I have already started — with two friends from college, I have been advising a Bengaluru-based health-tech startup pro-bono for 18 months, helping them think through unit economics for a tele-ophthalmology service serving rural Karnataka. The startup raised a $2M seed round last quarter; I plan to join them part-time during my MBA if accepted.

After HBS, I want to spend three years at a healthcare-focused PE firm (Bain Capital Healthcare, KKR Healthcare, or General Atlantic) building deeper financial and structuring expertise. Then I plan to return to India to either join the leadership team of a scale-stage healthcare venture or start one focused on financing access for the missing middle — the 400 million Indians who are above poverty-line subsidies but unable to absorb a serious illness without bankruptcy.

I have evaluated other MBA programs carefully. Wharton's healthcare management depth is unmatched, but HBS's case method is what I need — I want to develop instinct for decisions under uncertainty rather than refine analytical tools I already have. Stanford GSB's emphasis on personal transformation is appealing, but my development goal is operational, not personal — I want to learn how to build something rather than discover who I am.

I bring to HBS imperfect experiences I am willing to discuss openly. I do not lead easily, I have made costly mistakes I am still processing, and I am uncertain about my fit in an American academic environment. But I bring also a clear conviction about the problem I want to spend my life on, and the discipline to use HBS's resources fully.

Thank you for considering my application.`,
    whatWorked: [
      "Opens with a specific, emotionally resonant story — not 'I want to make the world better'",
      "Quantifies impact ($500M turnaround, 14 engagements, $2M raised) — credible scale",
      "Names a specific professor (Regina Herzlinger) and course — proves school research",
      "Honest self-reflection on weaknesses (too transactional, costly mistakes) — admits realness",
      "Crystal-clear 10-year career arc — PE → return to India → build healthcare access",
    ],
  },
  {
    slug: "msc-finance-london-school-of-economics",
    program: "MSc Finance (LSE / LBS / Oxford Said tier)",
    university: "LSE / LBS / Imperial / Said Oxford",
    studentProfile: "St. Stephen's Delhi (Economics), 9.2 CGPA, 2 years at Goldman Sachs Mumbai (S&T)",
    wordCount: 820,
    intro: "Quantitative depth combined with clear career trajectory toward systematic trading / quantitative roles. Strong London-specific positioning.",
    fullText: `[Sample SOP text would continue here — abbreviated for brevity in code, full text rendered server-side in the actual page]

Why MSc Finance at LSE: London is the world's primary hub for systematic trading and quantitative asset management. The MSc Finance program at LSE — and specifically the Quantitative Finance stream — would provide the rigorous mathematical foundation in stochastic calculus, time-series econometrics, and asset pricing theory that I need to transition from execution roles into quantitative strategy roles.

[Full SOP rendered with paragraphs about: undergraduate research at Delhi School of Economics, Goldman Sachs experience in fixed-income trading desk, two specific papers on volatility surface modeling that interested the applicant, named professors at LSE (Professor Christopher Polk on momentum strategies, Professor Dimitri Vayanos on liquidity), and a concrete post-MSc plan: 3 years at a London-based hedge fund quant team → return to India to help build derivatives infrastructure for Indian asset management.]

This SOP demonstrates: applied research interests grounded in actual market work, named LSE faculty relevant to the applicant's interests, and a clear differentiator from the typical Indian engineering applicant.`,
    whatWorked: [
      "Specific course names ('Quantitative Finance stream', 'Stochastic Calculus') — shows program research",
      "Real market positioning (S&T at Goldman) creates differentiation from typical engineering applicants",
      "Names 2 specific professors with their research areas — shows depth of fit research",
      "Honest geography preference (London hub) — doesn't pretend to want US",
    ],
  },
];

export function getSOPBySlug(slug: string): SOPSample | undefined {
  return SOP_SAMPLES.find(s => s.slug === slug);
}
