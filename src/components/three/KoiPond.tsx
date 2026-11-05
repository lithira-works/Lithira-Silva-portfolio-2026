import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { createPond } from "./pond";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface KoiPondProps {
  count?: number;
  interactive?: boolean;
  /** Read every frame: 0 = surface, 1 = dived in. */
  depth?: () => number;
  className?: string;
  label?: string;
}

let webglSupport: boolean | null = null;

/** Probe once per session and free the probe context, so it never counts against the browser's limit. */
function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    webglSupport = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function Fallback({ className }: { className?: string }) {
  return (
    <img
      className={className}
      src="/media/prints/hokkei-giant-carp.jpg"
      alt="Woodblock print of a giant carp in swirling water, by Totoya Hokkei"
      style={{ objectFit: "cover" }}
    />
  );
}

/** If anything in the 3D scene throws, show the print instead of taking the page down. */
class PondBoundary extends Component<{ className?: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Koi pond disabled:", error);
  }
  render() {
    return this.state.failed ? <Fallback className={this.props.className} /> : this.props.children;
  }
}

function Pond({ count, interactive = true, depth, className, label }: KoiPondProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef(depth);
  depthRef.current = depth;
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A fresh canvas per mount: a disposed renderer releases its context, and a
    // released context can never be reused (React dev mode mounts effects twice).
    const canvas = document.createElement("canvas");
    let pond: ReturnType<typeof createPond> | null = null;

    const build = () => {
      canvas.style.cssText = `display:block;width:100%;height:100%;touch-action:pan-y;cursor:${interactive ? "pointer" : "default"}`;
      host.appendChild(canvas);
      try {
        pond = createPond(canvas, {
          count: count ?? (window.innerWidth < 700 ? 6 : 10),
          interactive,
          reducedMotion: reduced,
          depth: () => depthRef.current?.() ?? 0,
        });
      } catch (error) {
        console.warn("Koi pond disabled:", error);
        setFailed(true);
      }
    };

    // Building a pond blocks the page for a moment, which a phone feels. One on screen now is built now;
    // one further down the page waits until the visitor is a screen away from it.
    let observer: IntersectionObserver | null = null;
    let waiting: number | null = null;
    if (host.getBoundingClientRect().top < window.innerHeight) {
      build();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          waiting = window.setTimeout(build, 0);
        },
        { rootMargin: "100% 0px" },
      );
      observer.observe(host);
    }

    return () => {
      observer?.disconnect();
      if (waiting !== null) window.clearTimeout(waiting);
      pond?.dispose();
      canvas.remove();
    };
  }, [count, interactive, reduced]);

  if (failed) return <Fallback className={className} />;

  return (
    <div
      ref={hostRef}
      className={className}
      role="img"
      aria-label={label ?? "A koi pond. Click or tap the water to feed the fish."}
    />
  );
}

export default function KoiPond(props: KoiPondProps) {
  const [supported] = useState(hasWebGL);
  if (!supported) return <Fallback className={props.className} />;
  return (
    <PondBoundary className={props.className}>
      <Pond {...props} />
    </PondBoundary>
  );
}
