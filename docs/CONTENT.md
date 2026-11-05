# Editing content

Every word on the site comes from `src/data/`. Edit, save, the dev server reloads.

> **Before launch:** the content shipped in these files is sample content written to show the design
> at full density. Replace every entry with your own. Never publish invented clients, employers,
> certificates or numbers.

## `site.ts` — who you are

| Field | Example | Shown |
| --- | --- | --- |
| `name` | `"Lithira"` | Page title, footer wordmark |
| `nameSplit` | `["LITH", "IRA"]` | The two hero corners. Two parts, ≤ 9 characters each. |
| `role` | `"Full-stack developer"` | Hero, meta description |
| `intro` | one sentence | Hero supporting line |
| `location`, `timezone` | | About facts, contact rows |
| `email`, `phone` | | Contact rows, mailto buttons |
| `socials` | `{ label, href }[]` | Footer, contact |
| `resumeUrl` | `/resume.pdf` | Put the file in `public/` |

## `projects.ts`

```ts
{
  slug: "tide-tables",
  title: "Tide Tables",
  summary: "One line, what it does and for whom.",
  year: 2026,
  role: "Design + full-stack",
  stack: ["Next.js", "PostgreSQL"],
  image: "/media/work/your-screenshot.jpg",
  gallery: [{ src: "/media/work/second.jpg", alt: "…" }], // optional, shown as thumbnails
  ratio: "3/2",          // "3/2" | "4/5" | "16/9" — sets the scatter placement
  live: "https://…",     // optional
  repo: "https://…",     // optional
  featured: true          // shown on the home page
}
```

Put screenshots in `public/media/work/`. The placeholder water photographs there must be replaced.

## `skills.ts`

Rows of the skills table, grouped. Each row: `group`, `name`, `level` (`"Daily"`, `"Often"`,
`"Learning"`), `years`.

## `certificates.ts`

`{ title, issuer, date, id?, url? }`. A `url` makes the frame a link to the credential.

## `experience.ts`

Two lists shown on the About page: `experience` and `education`, each `{ name, detail, year }`.
