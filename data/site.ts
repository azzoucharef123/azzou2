import { LinkItem } from "@/types/content";

export const siteConfig = {
  name: "Physics & Chemistry Under the Microscope",
  shortName: "P&C Microscope",
  description:
    "A premium editorial science magazine exploring physics, chemistry, research culture, and the ideas shaping modern laboratories.",
  url: "https://physics-chemistry-under-the-microscope.vercel.app",
  tagline: "Where rigorous science meets elegant editorial storytelling.",
  mission:
    "We translate complex physical and chemical research into deeply readable journalism without sacrificing precision, nuance, or intellectual ambition.",
  contactEmail: "editorial@microscope-magazine.com",
  socials: [
    { label: "X", href: "https://x.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Instagram", href: "https://instagram.com" }
  ] satisfies LinkItem[]
};

export const mainNavigation = [
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
  { label: "Categories", href: "/categories" },
  { label: "Issues", href: "/issues" },
  { label: "Team", href: "/team" },
  { label: "Authors", href: "/authors" },
  { label: "Contact", href: "/contact" }
] satisfies LinkItem[];
