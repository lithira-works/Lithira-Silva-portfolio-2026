import { useRef, type ReactNode, type PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/hooks/useReveal";

interface SectionProps {
  id: string;
  /** One or two kanji set vertically in the panel's corner. */
  kanji: string;
  kanjiMeaning: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * A framed panel: its own border, radius, padding and margin, and a spotlight that
 * follows the pointer. Its contents make their own entrances (useReveal).
 */
export function Section({ id, kanji, kanjiMeaning, title, intro, aside, className = "", children }: SectionProps) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      // No scrubbed clip-path on the panel: animating it repainted the whole section every scroll frame.
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".shell__kanji", {
          yPercent: 40,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
      });
    },
    { scope: root },
  );

  // The spotlight repaints the panel, so move it at most once per frame.
  const frame = useRef(0);
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };

  return (
    <section ref={root} id={id} className={`shell ${className}`} aria-labelledby={`${id}-title`} onPointerMove={onMove}>
      <span className="shell__kanji" aria-hidden="true" title={kanjiMeaning}>
        {kanji}
      </span>
      <header className="shell__head">
        <h2 id={`${id}-title`} className="shell__title head" data-split>
          {title}
        </h2>
        {(intro || aside) && (
          <div className="shell__side" data-reveal>
            {intro && <p className="shell__intro">{intro}</p>}
            {aside}
          </div>
        )}
      </header>
      {children}
    </section>
  );
}
