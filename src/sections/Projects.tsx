import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import type { Project } from "@/types/content";
import { skills } from "@/data/skills";
import { Section } from "@/components/ui/Section";
import { Arrow, ArrowLink } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface ProjectsProps {
  featuredOnly?: boolean;
}

/** Find a logo for a stack entry such as "React 18" or "Next.js 14". */
const logoFor = (entry: string) =>
  skills.find((s) => s.logo && entry.toLowerCase().startsWith(s.name.split(" ")[0].toLowerCase()));

/** The project's main image, with thumbnails that swap it when the project has a gallery. */
function WorkVisual({ project: p }: { project: Project }) {
  const images = [{ src: p.image, alt: p.alt }, ...(p.gallery ?? [])];
  const [active, setActive] = useState(0);
  const shown = images[active];

  return (
    <div className="work-visual">
      <figure
        className={`work-media ${p.screenshot ? "is-shot" : ""}`}
        style={p.screenshot ? { aspectRatio: p.screenshot } : undefined}
        data-cursor="View"
      >
        <img src={shown.src} alt={shown.alt} width={1600} height={1000} loading="lazy" decoding="async" />
      </figure>
      {images.length > 1 && (
        <ul className="work-thumbs" aria-label={`${p.title} screenshots`}>
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                className="work-thumb"
                aria-label={`Show screenshot ${i + 1} of ${images.length}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
              >
                <img src={image.src} alt="" width={1905} height={900} loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Stacking cards: each project pins under the next, shrinking back as it is covered. */
export function Projects({ featuredOnly = false }: ProjectsProps) {
  const list = featuredOnly ? projects.filter((p) => p.featured) : projects;
  const stack = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference) and (min-width: 761px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".work-card");
        cards.forEach((card, i) => {
          const inner = card.querySelector(".work-card__inner");
          if (i === cards.length - 1 || !inner) return;
          gsap.to(inner, {
            scale: 0.92,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true },
          });
        });
        cards.forEach((card) => {
          const img = card.querySelector(".work-media:not(.is-shot) img");
          if (!img) return;
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: stack },
  );

  return (
    <Section
      id="work"
      kanji="作品"
      kanjiMeaning="sakuhin: works"
      title="Selected work"
      intro="I learn by building: each project here pushed me into a new part of the stack."
      aside={featuredOnly ? <ArrowLink to="/projects">All project details</ArrowLink> : undefined}
    >
      <ol ref={stack} className="work-stack">
        {list.map((p, i) => (
          <li key={p.slug} className="work-card" style={{ top: `calc(var(--nav-h) + ${i * 22}px)` }}>
            <article className="work-card__inner">
              <div className="work-card__info">
                <p className="work-card__meta small">
                  <span className="tabular">{String(p.year)}</span>
                  <span className="work-card__dot" aria-hidden="true" />
                  <span>{p.role}</span>
                  {p.status && (
                    <span className={`status status--${p.status === "Live" ? "live" : "wip"}`}>{p.status}</span>
                  )}
                </p>
                <h3 className="work-card__title display">{p.title}</h3>
                <p className="work-card__summary">{p.summary}</p>
                {p.stack.length > 0 && (
                  <ul className="stack-chips" aria-label="Built with">
                    {p.stack.map((s) => {
                      const logo = logoFor(s);
                      return (
                        <li key={s} className="stack-chip small">
                          {logo && (
                            <img
                              src={`/media/tech/${logo.logo}.svg`}
                              alt=""
                              width={16}
                              height={16}
                              loading="lazy"
                            />
                          )}
                          {s}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <p className="work-card__links">
                  {p.live && (
                    <a className="work-link work-link--primary" href={p.live} target="_blank" rel="noreferrer">
                      Live site
                      <Arrow />
                    </a>
                  )}
                  {p.repo && (
                    <a className="work-link" href={p.repo} target="_blank" rel="noreferrer">
                      <SocialIcon name="GitHub" />
                      Source code
                    </a>
                  )}
                  {!p.live && !p.repo && <span className="small muted">Links coming soon</span>}
                </p>
              </div>

              <WorkVisual project={p} />
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
