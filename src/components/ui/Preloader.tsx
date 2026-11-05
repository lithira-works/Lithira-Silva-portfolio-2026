import { useEffect } from "react";
import { finishBoot } from "@/lib/boot";

/** Milliseconds from navigation start before the loader may open, so the seal can finish landing on fast connections. */
const MIN_SHOW_MS = 1600;
/** Slightly longer than the CSS transition that opens the two halves. */
const OPEN_MS = 1100;

/**
 * The loader lives in index.html and animates in CSS, so it paints before any JavaScript arrives and keeps
 * moving while the app and the pond are built. This only decides when to open it: effects run child-first,
 * so by now the first screen is mounted and its pond exists.
 */
export function Preloader() {
  useEffect(() => {
    const el = document.getElementById("pre");
    if (!el) {
      finishBoot();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.remove();
      finishBoot();
      return;
    }

    const frames: number[] = [];
    const timers: number[] = [];
    const nextFrame = (fn: () => void) => frames.push(requestAnimationFrame(fn));

    // Two frames: the app has painted once before the water parts.
    nextFrame(() =>
      nextFrame(() => {
        timers.push(
          window.setTimeout(() => {
            el.classList.add("is-leaving");
            nextFrame(finishBoot);
            timers.push(window.setTimeout(() => el.remove(), OPEN_MS));
          }, Math.max(0, MIN_SHOW_MS - performance.now())),
        );
      }),
    );

    return () => {
      frames.forEach(cancelAnimationFrame);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  return null;
}
