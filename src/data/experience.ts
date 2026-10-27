import type { RecordLine } from "@/types/content";

export const education: RecordLine[] = [
  {
    name: "BSc (Hons) Information Technology",
    detail: "SLIIT, Malabe · Dean's List, Y3 S1",
    year: "2023–now",
    photo: {
      src: "/media/about/deans-list-ceremony-1200.jpg",
      srcSmall: "/media/about/deans-list-ceremony-720.jpg",
      alt: "Lithira Silva receiving a Dean's List certificate on stage at the SLIIT Faculty of Computing ceremony",
      caption: "Dean's List ceremony, SLIIT Faculty of Computing",
    },
  },
  { name: "G.C.E. A/L, Commerce", detail: "D. S. Senanayake College", year: "2022–23" },
  { name: "G.C.E. O/L", detail: "I-GATE College", year: "2019" },
];

export const focus: RecordLine[] = [
  { name: "Software engineering", detail: "Year 3 focus", year: "" },
  { name: "Full-stack development", detail: "Year 3 focus", year: "" },
  { name: "Cloud computing", detail: "Learning", year: "" },
  { name: "AI integration", detail: "Exploring", year: "" },
];
