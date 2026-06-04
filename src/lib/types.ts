export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_slug: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  featured_image_credit: string | null;
  reading_time: number | null;
  tags: string[] | null;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  source_post_slug?: string;
  destination?: string;
  loan_amount?: string;
}
