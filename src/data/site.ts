import type { Site } from "@/types/content";

export const site: Site = {
  name: "Lithira Silva",
  handle: "li.kkaa",
  nameSplit: ["LITHIRA", "SILVA"],
  nameKana: ["リティラ", "シルバ"],
  role: "IT student and full-stack developer",
  intro: "IT undergraduate at SLIIT, building full-stack web and mobile apps with TypeScript, React and the MERN stack.",
  location: "Sri Lanka",
  flag: "/media/flags/lk.svg",
  timezone: "UTC+5:30",
  email: "llithira3@gmail.com",
  availability: "Open to internships and collaborations",
  siteUrl: "https://github.com/lithira-works/Lithira-Silva-portfolio-2026",
  socials: [
    { label: "GitHub", href: "https://github.com/lithira-works" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/lithira-silva-20b42a370/" },
  ],
};

export const facts: { label: string; value: string; flag?: string }[] = [
  { label: "Studying", value: "BSc (Hons) IT, SLIIT" },
  { label: "Currently", value: "Year 4, Semester 2" },
  { label: "Based in", value: `${site.location}, ${site.timezone}`, flag: site.flag },
];

export const story =
  "I'm Lithira Silva, a fourth-year IT undergraduate at SLIIT and a full-stack developer who builds AI into real products. My project Clipper uses Claude to find the best moments in long videos and turn them into captioned Shorts, and Oddjob is the home services marketplace I'm building now. I work across TypeScript, Python, Java and C++, made the Dean's List in Year 3, and hold AWS Academy Cloud Foundations and MongoDB credentials. Next, I want to help a team ship software where AI, cloud and solid engineering meet.";

/** The three chapters of the climb, shown in the pinned hero story. */
export const climb = [
  {
    title: "The pond",
    text: "Every koi starts in still water.",
  },
  {
    title: "The falls",
    text: "The legend says a carp that swims up the waterfall becomes a dragon. Learning software feels the same: the current never stops, you keep swimming.",
    image: "/media/prints/gakutei-red-carp.jpg",
    alt: "Woodblock print of a red carp climbing a waterfall, by Yashima Gakutei",
  },
  {
    title: "The climb",
    text: "Commerce at A/L, then IT at SLIIT. Now in year four, building smarter apps with full-stack, cloud and AI.",
    image: "/media/prints/hokusai-two-carp.jpg",
    alt: "Hokusai print of two carp swimming in a cascade",
  },
];
