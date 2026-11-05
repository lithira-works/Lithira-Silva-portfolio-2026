import type { Project } from "@/types/content";

// Images are placeholders: replace with real screenshots in public/media/work/.
// Add `live` and `repo` URLs when you have them.
export const projects: Project[] = [
  {
    slug: "oddjob",
    title: "Oddjob",
    summary:
      "Home services marketplace: households say what is wrong in their own words, and nearby tradespeople reply. Front-end preview with sample data, server-side chat screening and an admin dashboard.",
    year: 2026,
    role: "Full-stack",
    status: "In progress",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "GSAP", "Zod", "Vitest"],
    image: "/media/work/oddjob.jpg",
    screenshot: "1905 / 900",
    alt: "Oddjob home page: giant headline My fence is broken either side of a photo of a damaged fence, with a What's wrong at home search box and the reply That's a job for a fence and gate fixer",
    gallery: [
      {
        src: "/media/work/oddjob-trades.jpg",
        alt: "Oddjob trades section: headline Every odd job has someone, above trades such as plumber, carpenter and gardener in four columns",
      },
      {
        src: "/media/work/oddjob-jobs.jpg",
        alt: "Oddjob Homes that need help board: blue header with search, a credit balance and sample jobs with Answer for credits buttons",
      },
      {
        src: "/media/work/oddjob-workers.jpg",
        alt: "Oddjob People ready to work list: search and sort filters above sample workers with jobs booked, redone and called back counts",
      },
      {
        src: "/media/work/oddjob-categories.jpg",
        alt: "Oddjob Categories menu open: all trades grouped under Water and power, Wood and stone, Outside and Inside",
      },
      {
        src: "/media/work/oddjob-admin.jpg",
        alt: "Oddjob admin overview: sidebar navigation beside headline 2 things need you, a newest sample job and sample activity figures",
      },
      {
        src: "/media/work/oddjob-admin-jobs.jpg",
        alt: "Oddjob admin Jobs table: sample jobs with trade, rough area, replies, credits and status, with edit and delete actions",
      },
    ],
    ratio: "3/2",
    repo: "https://github.com/lithira-works/oddjob",
    featured: true,
  },
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
    featured: false,
  },
  {
    slug: "cloud-interactive",
    title: "Cloud Interactive",
    summary:
      "Interactive study site for Cloud Computing: 12 lectures as short chapters, with a subnet calculator, load-balancer simulator, Docker terminal, quizzes and spaced-repetition flashcards.",
    year: 2026,
    role: "Front-end",
    status: "Live",
    stack: ["JavaScript", "HTML5", "CSS3", "Vercel"],
    image: "/media/work/cloud-interactive.jpg",
    screenshot: "1905 / 900",
    alt: "Cloud Interactive home page: headline Learn Cloud Computing the fun way, above progress stats and lecture cards on a dark background",
    gallery: [
      {
        src: "/media/work/cloud-interactive-lecture.jpg",
        alt: "Cloud Interactive lecture page: Cloud Core Services and Global Infrastructure, with chapter links, progress at 100 percent and a definition box",
      },
      {
        src: "/media/work/cloud-interactive-exam.jpg",
        alt: "Cloud Interactive Exam Mode: lecture filters above question 1 of 25 with four numbered answers",
      },
      {
        src: "/media/work/cloud-interactive-cheatsheet.jpg",
        alt: "Cloud Interactive One-Page Cheat Sheet: revision bullets for each lecture in two columns, with tabs for memory hooks and exam traps",
      },
    ],
    ratio: "16/9",
    live: "https://cloud-interactive-omega.vercel.app",
    repo: "https://github.com/lithira-works/cloud-interactive",
    featured: false,
  },
  {
    slug: "venture-notes",
    title: "Venture Notes",
    summary:
      "Interactive study site for Innovation Management and Entrepreneurship: 11 lectures and 64 chapters, with interactive business canvases, finance practice tools, quizzes and spaced-repetition flashcards.",
    year: 2026,
    role: "Front-end",
    status: "Live",
    stack: ["JavaScript", "HTML5", "CSS3", "Vercel"],
    image: "/media/work/venture-notes.jpg",
    screenshot: "1905 / 900",
    alt: "Venture Notes home page: headline From a spark of an idea to a working venture, above a winding path of eleven numbered lectures, with a lecture list in the sidebar",
    gallery: [
      {
        src: "/media/work/venture-notes-lectures.jpg",
        alt: "Venture Notes All lectures section: eleven colour-coded lecture cards with progress bars, beside the lecture sidebar",
      },
      {
        src: "/media/work/venture-notes-lecture.jpg",
        alt: "Venture Notes Innovation lecture: chapter links and quiz buttons above the first chapter, with definition and memory hook notes in the margin",
      },
      {
        src: "/media/work/venture-notes-revision.jpg",
        alt: "Venture Notes Revision sheet: summary bullets for each lecture in two columns, with tabs for memory hooks and exam traps",
      },
    ],
    ratio: "4/5",
    live: "https://ime-interactive.vercel.app",
    repo: "https://github.com/lithira-works/ime-interactive",
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
