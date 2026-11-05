import { facts, story } from "@/data/site";
import { education, experience, focus } from "@/data/experience";
import { Section } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/Button";
import { useTilt } from "@/hooks/useTilt";

interface AboutProps {
  full?: boolean;
}

const highlights = [
  { title: "Dean's List", detail: "SLIIT, Year 3, Semester 1" },
  { title: "Claude API", detail: "Ranks the best video moments in Clipper" },
  { title: "AWS + MongoDB", detail: "AWS Academy Cloud Foundations and MongoDB Data Modeling" },
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
            src="/media/about/portrait-1122.jpg"
            srcSet="/media/about/portrait-720.jpg 720w, /media/about/portrait-1122.jpg 1122w"
            sizes="(max-width: 860px) 100vw, 40vw"
            alt="Portrait of Lithira Silva in a charcoal suit, white shirt and navy tie against a light grey background"
            width={1122}
            height={1402}
            loading="lazy"
          />
        </figure>

        <ul className="about__stats">
          {highlights.map((h) => (
            <li key={h.title} className="stat" data-reveal>
              <span className="stat__value display">{h.title}</span>
              <span className="small muted">{h.detail}</span>
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
