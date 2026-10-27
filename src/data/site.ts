import type { Site } from "@/types/content";

export const site: Site = {
  name: "Lithira Silva",
  nameSplit: ["LITHIRA", "SILVA"],
  role: "IT student and full-stack developer",
  intro: "IT undergraduate at SLIIT, building full-stack web and mobile apps with TypeScript, React and the MERN stack.",
  location: "Sri Lanka",
  timezone: "UTC+5:30",
  email: "llithira3@gmail.com",
  availability: "Open to internships and collaborations",
  siteUrl: "https://github.com/lithira-works/Lithira-Silva-portfolio-2026",
  socials: [{ label: "GitHub", href: "https://github.com/lithira-works" }],
};

export const facts = [
  { label: "Studying", value: "BSc (Hons) IT, SLIIT" },
  { label: "Currently", value: "Year 3, Semester 1" },
  { label: "Based in", value: `${site.location}, ${site.timezone}` },
];

export const story =
  "I'm an IT undergraduate at SLIIT and a full-stack developer working in TypeScript, Java, Python, C++ and the MERN stack. I build web and Android apps that solve real problems, from a construction bidding platform to an AI task manager. Right now I'm diving into cloud computing and AI.";

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
    text: "Commerce at A/L, then IT at SLIIT. Now in year three, shipping full-stack apps and learning the cloud.",
    image: "/media/prints/hokusai-two-carp.jpg",
    alt: "Hokusai print of two carp swimming in a cascade",
  },
];
