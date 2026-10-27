import { facts, story } from "@/data/site";
import { education, experience, focus } from "@/data/experience";
import { projects } from "@/data/projects";
import { certificates } from "@/data/certificates";
import { skills } from "@/data/skills";
import { Section } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/Button";
import { useTilt } from "@/hooks/useTilt";

interface AboutProps {
  full?: boolean;
}

const stats = [
  { value: projects.length, label: "Projects built" },
  { value: certificates.length, label: "Certificates" },
  { value: skills.length, label: "Tools in the kit" },
];

export function About({ full = false }: AboutProps) {
  const tilt = useTilt(6);

  return (
    <Section
      id="about"
      kanji="私"
      kanjiMeaning="watashi: me"
      title={
        <>
          About
          <br />
          the developer
        </>
      }
      intro="IT undergraduate, full-stack developer, always one current further upstream."
    >
      <div className="about__grid">
        <div className="about__story">
          <p className="about__text" data-reveal>
            {story}
          </p>
          <dl className="about__facts">
            {facts.map((f) => (
              <div key={f.label} className="fact" data-reveal>
                <dt className="small muted">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          {!full && (
            <div data-reveal>
              <ArrowLink to="/about">More about me</ArrowLink>
            </div>
          )}
        </div>

        <figure className="about__art" data-reveal {...tilt}>
          <img
            src="/media/prints/hokkei-giant-carp.jpg"
            alt="Woodblock print by Totoya Hokkei of a boy riding a giant carp through swirling water"
            width={1920}
            height={1108}
            loading="lazy"
          />
          <figcaption className="small">Totoya Hokkei, around 1830. The Met, public domain.</figcaption>
        </figure>

        <ul className="about__stats">
          {stats.map((s) => (
            <li key={s.label} className="stat" data-reveal>
              <span className="stat__value display tabular" data-count={s.value}>
                {s.value}
              </span>
              <span className="small muted">{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="about__timeline">
          <h3 className="about__sub">Experience</h3>
          <ol className="timeline">
            {experience.map((r) => (
              <li key={r.name} className="timeline__item" data-reveal>
                <span className="timeline__year small tabular">{r.year}</span>
                <span className="timeline__name">{r.name}</span>
                <span className="small muted">{r.detail}</span>
              </li>
            ))}
          </ol>

          <h3 className="about__sub">Education</h3>
          <ol className="timeline">
            {education.map((r) => (
              <li key={r.name} className="timeline__item" data-reveal>
                <span className="timeline__year small tabular">{r.year}</span>
                <span className="timeline__name">{r.name}</span>
                <span className="small muted">{r.detail}</span>
                {r.photo && (
                  <figure className="timeline__photo">
                    <img
                      src={r.photo.src}
                      srcSet={`${r.photo.srcSmall} 720w, ${r.photo.src} 1200w`}
                      sizes="(max-width: 860px) 100vw, 40vw"
                      alt={r.photo.alt}
                      width={1200}
                      height={800}
                      loading="lazy"
                    />
                    <figcaption className="small muted">{r.photo.caption}</figcaption>
                  </figure>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="about__focus">
          <h3 className="about__sub">Right now</h3>
          <ul className="chips">
            {focus.map((r) => (
              <li key={r.name} className="chip-tag" data-reveal>
                {r.name}
                <span className="muted"> · {r.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
