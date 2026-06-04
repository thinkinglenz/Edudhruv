import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    slug: "education-loan",
    name: "Education Loan",
    description: "Education loan guides, bank comparisons, and repayment tips for Indian students studying abroad.",
    color: "bg-blue-100 text-blue-700",
    icon: "🏦",
  },
  {
    slug: "indian-students-abroad",
    name: "Indian Students Abroad",
    description: "Life abroad for Indian students — visas, banking, food, communities and survival guides.",
    color: "bg-orange-100 text-orange-700",
    icon: "✈️",
  },
  {
    slug: "scholarship",
    name: "Scholarship",
    description: "Top scholarships for Indian students — how to apply, eligibility and winning tips.",
    color: "bg-green-100 text-green-700",
    icon: "🎓",
  },
  {
    slug: "top-universities",
    name: "Top Universities",
    description: "Rankings, comparisons and guides to the best universities worldwide for Indian students.",
    color: "bg-purple-100 text-purple-700",
    icon: "🏛️",
  },
  {
    slug: "student-accommodation",
    name: "Student Accommodation",
    description: "Finding affordable housing abroad — dorms, private rentals, tips to avoid scams.",
    color: "bg-teal-100 text-teal-700",
    icon: "🏠",
  },
  {
    slug: "travel-essentials",
    name: "Travel Essentials",
    description: "Travel insurance, packing lists, cheap flights and transport tips for students.",
    color: "bg-yellow-100 text-yellow-700",
    icon: "🧳",
  },
  {
    slug: "latest",
    name: "Latest",
    description: "Latest news and updates from the study abroad world.",
    color: "bg-red-100 text-red-700",
    icon: "📰",
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
