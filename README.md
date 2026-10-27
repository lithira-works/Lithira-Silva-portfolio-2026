<div align="center">

# Lithira Silva — Portfolio

**A scroll-driven developer portfolio built around a live 3D koi pond.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![three.js](https://img.shields.io/badge/three.js-r169-000000?logo=threedotjs&logoColor=white)](https://threejs.org)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white)](https://gsap.com)

</div>

---

## About

This is the personal portfolio of **Lithira Silva**, an IT undergraduate at SLIIT and full-stack developer.

The design follows one idea: **koi-no-takinobori**, the carp that climbs the waterfall. In Japanese legend, a koi that swims up the falls becomes a dragon. Here the scroll is the climb. The landing page opens on a live 3D koi pond, and each section after it is one step further up the falls.

> Tap the pond to drop food. The koi notice.

## Features

- **Interactive 3D hero.** Procedural koi in vanilla three.js, with a swimming vertex shader, caustics, lily pads and drifting petals. Click or tap to feed them.
- **Scroll storytelling.** A pinned "climb" sequence, a scrubbed camera dive and staggered entrances, all with GSAP ScrollTrigger and SplitText.
- **Smooth scrolling.** Lenis runs on the GSAP ticker, so scroll and animation stay in sync.
- **Six routes.** Home, About, Projects, Skills, Certificates and Contact, with a curtain page transition.
- **Data-driven content.** All text, projects, skills and certificates live in typed files in `src/data/`.
- **Accessible motion.** The site respects `prefers-reduced-motion` and stays usable on mobile.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Build | [Vite](https://vitejs.dev) + TypeScript | Instant dev server and typed content. |
| UI | React 18 + React Router 6 | Six routes that share sections. |
| Motion | [GSAP 3](https://gsap.com) (ScrollTrigger, SplitText, `@gsap/react`) | Pinned story, scrubbed camera dive, staggered entrances. |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering) | Driven by the GSAP ticker so ScrollTrigger stays in sync. |
| 3D | [three.js](https://threejs.org), no wrapper | Full control over shaders and the render loop. |
| Type | Barlow Condensed / Barlow | Road-sign condensed display face. The name is set as architecture. |

## Getting started

**Requirements:** Node.js 18 or later.

```bash
git clone https://github.com/lithira-works/Lithira-Silva-portfolio-2026.git
cd Lithira-Silva-portfolio-2026
npm install
npm run dev
```

Then open <http://localhost:5173>.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server. |
| `npm run build` | Type-check, then build for production into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run typecheck` | Run the TypeScript checker only. |

## Routes

| Path | Page |
| --- | --- |
| `/` | Home: pond hero, the climb, then a short look at every section |
| `/about` | About: facts, story, experience and education |
| `/projects` | Projects: every project in a loose scatter |
| `/skills` | Skills: the full skills table |
| `/certificates` | Certificates: a scrollable strip of credentials |
| `/contact` | Contact: display rows and one email button |

## Project structure

```text
src/
├── app/            Route definitions
├── components/
│   ├── layout/     Navbar, footer, page transition
│   ├── three/      Koi pond scene (koi, pond, renderer)
│   └── ui/         Button, cursor, marquee, preloader
├── data/           All site content: profile, projects, skills, certificates
├── hooks/          Lenis, reveal, tilt, reduced-motion helpers
├── lib/            GSAP setup and boot sequence
├── pages/          One component per route
├── sections/       Page sections shared across routes
├── styles/         Design tokens, base, layout and section CSS
└── types/          Content types
public/             Images, certificates, icons
docs/               Architecture, design, content and deployment guides
```

## Editing content

All content lives in [`src/data/`](src/data). You never need to touch a component to change the words. See [docs/CONTENT.md](docs/CONTENT.md) for every field.

## Deployment

The project builds to static files and ships with `vercel.json` and `public/_redirects` for client-side routing. It deploys to Vercel, Netlify or GitHub Pages. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Documentation

- [Architecture](docs/ARCHITECTURE.md): folders, data flow, and how the 3D scene and GSAP fit together
- [Design](docs/DESIGN.md): the design system, covering idea, type, colour, layout and motion rules
- [Content](docs/CONTENT.md): editing your name, projects, skills and certificates
- [Deployment](docs/DEPLOYMENT.md): Vercel, Netlify and GitHub Pages
- [Credits](docs/CREDITS.md): every image used and its licence
- [Changelog](CHANGELOG.md)

## Contact

**Lithira Silva**: [GitHub](https://github.com/lithira-works) · [llithira3@gmail.com](mailto:llithira3@gmail.com)

Open to internships and collaborations.

## Credits

The woodblock prints by Hokusai, Yashima Gakutei, Totoya Hokkei and Shibata Zeshin are public domain or CC0. Project photos use the Unsplash licence. Full sources and licences are in [docs/CREDITS.md](docs/CREDITS.md).

© 2026 Lithira Silva. All rights reserved.
