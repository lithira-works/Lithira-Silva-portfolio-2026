import { certificates } from "@/data/certificates";
import type { Certificate } from "@/types/content";
import { Section } from "@/components/ui/Section";
import { ArrowLink } from "@/components/ui/Button";
import { useTilt } from "@/hooks/useTilt";
import { Seal } from "@/components/ui/Seal";

interface CertificatesProps {
  compact?: boolean;
}

function CertCard({ c }: { c: Certificate }) {
  const tilt = useTilt(10);
  const href = c.url ?? c.pdf;
  return (
    <li className="cert-card" data-reveal>
      <a className="cert-card__frame" href={href} target="_blank" rel="noreferrer" data-cursor="Open" {...tilt}>
        {c.image ? (
          <img src={c.image} alt={`${c.title} certificate`} width={1400} height={1042} loading="lazy" />
        ) : (
          <span className="cert-card__placeholder display">{c.issuer}</span>
        )}
        <span className="cert-card__glare" aria-hidden="true" />
        <Seal size="md" className="cert-card__seal" />
      </a>
      <div className="cert-card__body">
        <p className="small muted">
          {c.issuer} · <span className="tabular">{c.date}</span>
        </p>
        <h3 className="cert-card__title">{c.title}</h3>
        {c.skills && (
          <ul className="chips chips--small">
            {c.skills.map((s) => (
              <li key={s} className="chip-tag">
                {s}
              </li>
            ))}
          </ul>
        )}
        <p className="cert-card__links">
          {c.url && (
            <ArrowLink href={c.url} target="_blank" rel="noreferrer">
              Verify
            </ArrowLink>
          )}
          {c.pdf && (
            <ArrowLink href={c.pdf} target="_blank" rel="noreferrer">
              PDF
            </ArrowLink>
          )}
        </p>
        {c.id && <p className="cert-card__id small muted">ID {c.id}</p>}
      </div>
    </li>
  );
}

export function Certificates({ compact = false }: CertificatesProps) {
  return (
    <Section
      id="certificates"
      kanji="証"
      kanjiMeaning="shō: proof"
      title="Certificates"
      intro={
        certificates.length
          ? "Courses and programmes I have completed. Open any one to see the original."
          : "New credentials are on the way."
      }
      aside={compact ? <ArrowLink to="/certificates">Every certificate</ArrowLink> : undefined}
    >
      {certificates.length > 0 && (
        <ul className="cert-grid">
          {certificates.map((c) => (
            <CertCard key={c.title} c={c} />
          ))}
        </ul>
      )}
    </Section>
  );
}
