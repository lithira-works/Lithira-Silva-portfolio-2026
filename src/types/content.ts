export type Ratio = "3/2" | "4/5" | "16/9";

export interface Social {
  label: string;
  href: string;
}

export interface Site {
  name: string;
  nameSplit: [string, string];
  /** The name in katakana, one entry per vertical column of the seal (read right to left). */
  nameKana: [string, string];
  role: string;
  intro: string;
  location: string;
  timezone: string;
  email: string;
  phone?: string;
  availability: string;
  resumeUrl?: string;
  siteUrl: string;
  socials: Social[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  year: number;
  role: string;
  status?: string;
  stack: string[];
  image: string;
  alt: string;
  /** Set for a real screenshot: shown whole at this width/height ratio, without the parallax zoom. */
  screenshot?: string;
  ratio: Ratio;
  live?: string;
  repo?: string;
  featured?: boolean;
}

export interface Skill {
  group: string;
  name: string;
  /** Project titles that use it; filled in from projects.ts. */
  usedIn?: string[];
  /** Other proof, such as a certificate. */
  note?: string;
  /** File name in public/media/tech/ without .svg */
  logo?: string;
  /** Brand colour for the tile glow. */
  color?: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  id?: string;
  /** Online verification page. */
  url?: string;
  /** Copy of the certificate in public/certificates/. */
  pdf?: string;
  /** First page rendered as an image. */
  image?: string;
  skills?: string[];
}

export interface RecordLine {
  name: string;
  detail: string;
  year: string;
  /** Optional photo shown under the row, e.g. an award ceremony. */
  photo?: { src: string; srcSmall: string; alt: string; caption: string };
}
