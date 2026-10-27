import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { Section } from "@/components/ui/Section";
import { Arrow, ArrowLink } from "@/components/ui/Button";

interface ProjectsProps {
  featuredOnly?: boolean;
}

/** Find a logo for a stack entry such as "React 18" or "Next.js 14". */
const logoFor = (entry: string) =>
  skills.find((s) => s.logo && entry.toLowerCase().startsWith(s.name.split(" ")[0].toLowerCase()));

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
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
                      <GitHubMark />
                      Source code
                    </a>
                  )}
                  {!p.live && !p.repo && <span className="small muted">Links coming soon</span>}
                </p>
              </div>

              <figure
                className={`work-media ${p.screenshot ? "is-shot" : ""}`}
                style={p.screenshot ? { aspectRatio: p.screenshot } : undefined}
                data-cursor="View"
              >
                <img src={p.image} alt={p.alt} width={1600} height={1000} loading="lazy" decoding="async" />
              </figure>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
