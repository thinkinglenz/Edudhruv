"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Education Loan",    href: "/education-loan" },
  { label: "Scholarships",      href: "/scholarship" },
  { label: "Universities",      href: "/top-universities" },
  { label: "Students Abroad",   href: "/indian-students-abroad" },
  { label: "Accommodation",     href: "/student-accommodation" },
  { label: "Travel",            href: "/travel-essentials" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="EduDhruv — Study Abroad Guidance"
            width={140}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2.5 py-1.5 text-sm font-medium text-edu-dark hover:text-brand hover:bg-brand-light rounded-md transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTAs — Advertise + Get Help */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <Link
            href="/advertise"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg border-2 transition-colors hover:bg-orange-50 whitespace-nowrap"
            style={{ borderColor: "#F5A71A", color: "#F5A71A" }}
          >
            📣 Advertise
          </Link>
          <Link
            href="/loan-portal"
            className="inline-flex items-center gap-1.5 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors shadow-sm whitespace-nowrap"
          >
            Get Free Help →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-edu-dark"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-edu-dark border-b border-gray-50 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/advertise"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-sm font-medium border-b border-gray-50 hover:text-brand"
            style={{ color: "#F5A71A" }}
          >
            📣 Advertise with us
          </Link>
          <Link
            href="/loan-portal"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center bg-brand text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-brand-dark transition-colors"
          >
            Get Free Consultation →
          </Link>
        </div>
      )}
    </header>
  );
}
