import type { Project } from "@/types/content";

// Images are placeholders: replace with real screenshots in public/media/work/.
// Add `live` and `repo` URLs when you have them.
export const projects: Project[] = [
  {
    slug: "island-of-gems",
    title: "Island of Gems",
    summary:
      "5x3, 20-line video slot with a tropical island theme: a Python math engine with RTP simulation, and a playable canvas front end with reel physics, free spins and procedural audio.",
    year: 2026,
    role: "Game dev",
    stack: ["Python", "JavaScript", "HTML5 Canvas", "Web Audio"],
    image: "/media/work/island-of-gems.jpg",
    screenshot: "1905 / 900",
    alt: "Island of Gems slot game: 5x3 reels of gems, numbers and a leopard symbol in a gold frame, with a moonlit island and lighthouse behind",
    ratio: "16/9",
    repo: "https://github.com/lithira-works/island-of-gems",
    featured: true,
  },
  {
    slug: "clipper",
    title: "Clipper",
    summary:
      "Paste a YouTube link, get captioned 9:16 Shorts: finds the most-replayed moments, ranks them with Claude, tracks the speaker and burns in word-by-word captions.",
    year: 2026,
    role: "Full-stack",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "Redis", "Docker"],
    image: "/media/work/clipper.jpg",
    screenshot: "1905 / 900",
    alt: "Clipper home page: headline Turn long videos into viral Shorts, a YouTube link field with caption and length options, and a phone previewing a captioned Short",
    ratio: "3/2",
    repo: "https://github.com/lithira-works/clipper",
    featured: true,
  },
  {
    slug: "sportx",
    title: "SportX Arena",
    summary:
      "Website for an indoor cricket facility: live pitch availability, slot booking with lane-level rules, tournament registration and accounts.",
    year: 2026,
    role: "Front-end",
    stack: ["React 19", "Vite", "Tailwind CSS", "React Router"],
    image: "/media/work/sportx.jpg",
    screenshot: "1905 / 900",
    alt: "SportX Arena home page: hero slide Bowling Machine Sessions with Book your pitch now and View pricing buttons over a cricket ball photo",
    ratio: "4/5",
    repo: "https://github.com/lithira-works/sportx",
    featured: true,
  },
  {
    slug: "construction-platform",
    title: "Construction Bidding Platform",
    summary:
      "Construction management platform with advanced bidding systems and automated project oversight.",
    year: 2025,
    role: "Full-stack",
    stack: [],
    image: "/media/work/water-637.jpg",
    alt: "Metal ladder at the edge of a wooden dock over still water at dusk",
    ratio: "3/2",
    featured: false,
  },
  {
    slug: "fitgeek",
    title: "FitGeek",
    summary:
      "Premium fitness and wellness website for gym centres: services, membership packages, trainer profiles and an integrated contact system.",
    year: 2025,
    role: "Front-end",
    status: "Live",
    stack: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "EmailJS", "React Router"],
    image: "/media/work/fitgeek.jpg",
    screenshot: "1905 / 900",
    alt: "FitGeek home page: hero headline Transform Your Wellness Journey beside a photo of a woman training on a mat",
    ratio: "4/5",
    featured: false,
  },
  {
    slug: "nexto",
    title: "NexTo",
    summary:
      "AI-powered task manager with natural-language parsing, priority detection and personal productivity insights.",
    year: 2025,
    role: "Full-stack",
    status: "In progress",
    stack: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "Zustand", "Supabase", "PostgreSQL"],
    image: "/media/work/water-124.jpg",
    alt: "Small red boat on clear turquoise water, seen from above",
    ratio: "16/9",
    featured: false,
  },
];
