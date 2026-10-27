import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one loop. */
  speed?: number;
  reverse?: boolean;
  /** Lean into the scroll: faster and skewed while the page moves. */
  reactive?: boolean;
  className?: string;
  label?: string;
}

/** Infinite horizontal loop. The track is duplicated so the seam never shows. */
export function Marquee({ children, speed = 30, reverse = false, reactive = true, className = "", label }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.fromTo(
          ".marquee__track",
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 },
        );
        if (!reactive) return;
        // Two reusable tweeners; onUpdate runs every scroll frame, so it must not create tweens.
        const skew = gsap.quickTo(".marquee__track", "skewX", { duration: 0.5, ease: "power3" });
        const pace = { t: 1 };
        const toSpeed = gsap.quickTo(pace, "t", {
          duration: 0.4,
          ease: "power2.out",
          onUpdate: () => {
            loop.timeScale(pace.t);
          },
        });
        let settle = 0;
        let dir = 1;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            dir = self.direction === 1 ? 1 : -1;
            toSpeed(dir * gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 600));
            skew(gsap.utils.clamp(-8, 8, v / -250));
            window.clearTimeout(settle);
            settle = window.setTimeout(() => {
              skew(0);
              toSpeed(dir);
            }, 150);
          },
        });
        return () => window.clearTimeout(settle);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`marquee ${className}`} aria-label={label} role={label ? "img" : undefined}>
      <div className="marquee__track" aria-hidden={label ? true : undefined}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
