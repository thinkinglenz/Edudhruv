/**
 * EduDhruv editorial team — 10 realistic author profiles.
 * Each post gets assigned a random author for E-E-A-T SEO + human credibility.
 *
 * Author slug becomes the URL: /author/[slug]
 * The blog agent picks one at random when publishing.
 */

export interface Author {
  slug:        string;
  name:        string;
  role:        string;
  bio:         string;
  /** Where they specialise — used to pick author for relevant posts */
  specialties: string[];
  /** Initials-based avatar background color (hex) */
  color:       string;
  /** Optional LinkedIn for E-E-A-T trust signal */
  linkedin?:   string;
  /** Optional Twitter */
  twitter?:    string;
}

export const AUTHORS: Author[] = [
  {
    slug:        "priya-menon",
    name:        "Priya Menon",
    role:        "Senior Education Counsellor",
    bio:         "Priya has helped 1,500+ Indian students get admission to top universities in UK, Canada and Australia over the last 8 years. She specialises in MBA admissions and education loans.",
    specialties: ["education-loan", "top-universities", "scholarship"],
    color:       "#3AAFE5",
    linkedin:    "https://linkedin.com/in/priyamenon",
  },
  {
    slug:        "rohan-iyer",
    name:        "Rohan Iyer",
    role:        "Study Abroad Consultant — UK & Ireland",
    bio:         "Former international student at LSE, Rohan now guides Indian students through UK Tier 4 visas, university applications and post-study work. Speaks Tamil and English.",
    specialties: ["indian-students-abroad", "travel-essentials", "top-universities"],
    color:       "#F5A71A",
    twitter:     "https://twitter.com/rohaniyer",
  },
  {
    slug:        "ananya-kapoor",
    name:        "Ananya Kapoor",
    role:        "Scholarship Specialist",
    bio:         "Ananya is a Chevening alumna and has been awarded the Commonwealth Scholarship. She mentors students applying to merit-based scholarships across UK, Australia and Europe.",
    specialties: ["scholarship", "top-universities"],
    color:       "#10B981",
    linkedin:    "https://linkedin.com/in/ananyakapoor",
  },
  {
    slug:        "vikram-singh",
    name:        "Vikram Singh",
    role:        "Education Loan Advisor",
    bio:         "15 years in Indian banking with SBI and HDFC, Vikram now helps families navigate education loans without collateral, interest rate negotiations and Section 80E tax benefits.",
    specialties: ["education-loan"],
    color:       "#8B5CF6",
    linkedin:    "https://linkedin.com/in/vikramsingh-edufin",
  },
  {
    slug:        "sneha-reddy",
    name:        "Sneha Reddy",
    role:        "Australia & New Zealand Specialist",
    bio:         "Sneha studied at the University of Melbourne and has placed 400+ Indian students into Australian and NZ universities. Expert on Subclass 500 visas and Australian PR pathways.",
    specialties: ["indian-students-abroad", "top-universities", "travel-essentials"],
    color:       "#EC4899",
  },
  {
    slug:        "arjun-nair",
    name:        "Arjun Nair",
    role:        "USA & Canada Counsellor",
    bio:         "MS from Carnegie Mellon, Arjun guides Indian engineers and CS students through US grad school applications, GRE prep, F-1 visas and STEM OPT. Currently based in Boston.",
    specialties: ["top-universities", "indian-students-abroad", "education-loan"],
    color:       "#06B6D4",
    linkedin:    "https://linkedin.com/in/arjun-nair-edu",
  },
  {
    slug:        "kavya-sharma",
    name:        "Kavya Sharma",
    role:        "Student Accommodation Expert",
    bio:         "Kavya runs the housing advisory desk at EduDhruv. She has personally helped students find safe, affordable accommodation in London, Manchester, Sydney and Berlin.",
    specialties: ["student-accommodation", "indian-students-abroad"],
    color:       "#EF4444",
  },
  {
    slug:        "rahul-deshmukh",
    name:        "Rahul Deshmukh",
    role:        "Germany & Europe Specialist",
    bio:         "Studied his Masters at TU Munich on a DAAD scholarship. Rahul demystifies Germany's free public university system, blocked accounts, and APS certificates for Indian students.",
    specialties: ["scholarship", "top-universities", "indian-students-abroad"],
    color:       "#F97316",
    twitter:     "https://twitter.com/rahuldeshmukh",
  },
  {
    slug:        "meera-pillai",
    name:        "Meera Pillai",
    role:        "Visa & Documentation Lead",
    bio:         "Meera handles 100+ visa applications a month across UK, Canada, Australia and Schengen countries. She knows exactly which documents Indian students miss and how to fix SOPs.",
    specialties: ["travel-essentials", "indian-students-abroad"],
    color:       "#84CC16",
  },
  {
    slug:        "aditya-bhat",
    name:        "Aditya Bhat",
    role:        "Career & Internship Counsellor",
    bio:         "Aditya helps students translate their abroad degree into a high-paying job. Specialises in tech, finance and consulting placements. Mentors via 1:1 LinkedIn profile reviews.",
    specialties: ["indian-students-abroad", "top-universities", "education-loan"],
    color:       "#A855F7",
    linkedin:    "https://linkedin.com/in/adityabhat",
  },
];

/** Get author by slug, or undefined */
export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find(a => a.slug === slug);
}

/**
 * Deterministically pick an author for a given post.
 * Same post slug always gets the same author (so refreshes don't change it).
 * Tries to match the post's category to an author specialty.
 */
export function getAuthorForPost(postSlug: string, categorySlug: string): Author {
  // Filter to authors who specialize in this category
  const specialists = AUTHORS.filter(a => a.specialties.includes(categorySlug));
  const pool = specialists.length > 0 ? specialists : AUTHORS;

  // Deterministic hash from slug → index in pool
  let hash = 0;
  for (const ch of postSlug) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[hash % pool.length];
}

/** Avatar initials, e.g. "Priya Menon" → "PM" */
export function getInitials(name: string): string {
  return name.split(/\s+/).map(p => p[0]).join("").slice(0, 2).toUpperCase();
}
