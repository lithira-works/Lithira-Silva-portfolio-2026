import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { Link, useLocation, useNavigate, type LinkProps } from "react-router-dom";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToTop } from "@/hooks/useLenis";

type Go = (to: string) => void;
const TransitionContext = createContext<Go>(() => {});

const titles: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/projects": "Projects",
  "/skills": "Skills",
  "/certificates": "Certificates",
  "/contact": "Contact",
};

/**
 * Ink curtain between routes: rises to cover, the route swaps, then it lifts away.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const busy = useRef(false);
  const first = useRef(true);

  const go = useCallback<Go>(
    (to) => {
      const [path] = to.split("#");
      if (busy.current) return;
      if (path === pathname || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        navigate(to);
        return;
      }
      busy.current = true;
      if (label.current) label.current.textContent = titles[path] ?? "";
      gsap.fromTo(
        curtain.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.6, ease: "power4.inOut", onComplete: () => void navigate(to) },
      );
      gsap.fromTo(label.current, { yPercent: 120 }, { yPercent: 0, duration: 0.6, delay: 0.15, ease: "power3.out" });
    },
    [navigate, pathname],
  );

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      scrollToTop();
    }
    ScrollTrigger.refresh();
    if (!busy.current) return;
    gsap.to(curtain.current, {
      yPercent: -100,
      duration: 0.7,
      delay: 0.1,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(curtain.current, { yPercent: 100 });
        busy.current = false;
      },
    });
  }, [pathname, hash]);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div ref={curtain} className="curtain" aria-hidden="true">
        <span className="curtain__label display">
          <span ref={label} />
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

export const useGo = () => useContext(TransitionContext);

/** A router link that plays the curtain. */
export function TLink({ to, onClick, ...rest }: LinkProps & { to: string }) {
  const go = useGo();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  return <Link to={to} onClick={handle} {...rest} />;
}
