import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { finishBoot, isBooted } from "@/lib/boot";
import { site } from "@/data/site";
import { Seal } from "./Seal";

/** Seconds the loader runs before it hands over to the hero. */
export const PRELOAD_SECONDS = 2.1;

/** First visit only: the koi kanji appears, a counter fills, the water parts. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(isBooted);

  useGSAP(
    () => {
      if (isBooted()) return;
      const finish = () => {
        finishBoot();
        setDone(true);
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
      // Never let the overlay trap the page, whatever happens to the timeline.
      const safety = window.setTimeout(finish, (PRELOAD_SECONDS + 1.5) * 1000);
      const n = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(safety);
          finish();
        },
      });
      // The seal is pressed down like a stamp, then the name rises beneath it.
      tl.fromTo(
        ".pre__seal",
        { scale: 1.9, rotate: -14, opacity: 0 },
        { scale: 1, rotate: -4, opacity: 1, duration: 0.45, ease: "power4.in" },
      )
        .to(".pre__seal", { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out" })
        .from(".pre__name", { y: 14, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.4)
        .to(
          n,
          {
            v: 100,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, "0");
            },
          },
          0.1,
        )
        .to(".pre__bar-fill", { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0.1)
        .to(".pre__inner", { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" }, 1.35)
        .to(".pre__half--top", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, 1.45)
        .to(".pre__half--bottom", { yPercent: 100, duration: 0.8, ease: "expo.inOut" }, 1.45);
      return () => window.clearTimeout(safety);
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} className="pre" aria-hidden="true">
      <div className="pre__half pre__half--top" />
      <div className="pre__half pre__half--bottom" />
      <div className="pre__inner">
        <Seal size="lg" className="pre__seal" />
        <span className="pre__name display">{site.name}</span>
        <div className="pre__bar">
          <span className="pre__bar-fill" />
        </div>
        <span className="pre__count tabular" ref={count}>
          000
        </span>
      </div>
    </div>
  );
}
