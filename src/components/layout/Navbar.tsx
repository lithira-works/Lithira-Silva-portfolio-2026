import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { TLink, useGo } from "./Transition";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToId } from "@/hooks/useLenis";
import { site } from "@/data/site";
import { Seal } from "@/components/ui/Seal";

/** Each link is a section on the home page and its own page everywhere else. */
const links = [
  { id: "about", to: "/about", label: "About" },
  { id: "work", to: "/projects", label: "Projects" },
  { id: "skills", to: "/skills", label: "Skills" },
  { id: "certificates", to: "/certificates", label: "Certificates" },
];
const contact = { id: "contact", to: "/contact", label: "Contact" };

export function Navbar() {
  const nav = useRef<HTMLElement>(null);
  const list = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const { pathname } = useLocation();
  const go = useGo();
  const home = pathname === "/";
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setSection(null);
  }, [pathname]);

  // The bar steps aside while reading down and returns on the way up.
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const el = nav.current;
        if (!el) return;
        const y = self.scroll();
        el.classList.toggle("is-scrolled", y > 80);
        el.classList.toggle("is-hidden", self.direction === 1 && y > 240 && !el.matches(":hover, :focus-within"));
      },
    });
  });

  // Scroll-spy: on the home page the link for the section under the middle of the screen lights up.
  useGSAP(
    () => {
      if (!home) return;
      [...links, contact].forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setSection(id);
            else setSection((cur) => (cur === id ? null : cur));
          },
        });
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  const activeId = home ? section : [...links, contact].find((l) => l.to === pathname)?.id ?? null;
  const target = hover ?? activeId;

  // Slide the pill under the hovered link, or the active one.
  useLayoutEffect(() => {
    const p = pill.current;
    const host = list.current;
    if (!p || !host) return;
    const el = target ? host.querySelector<HTMLElement>(`[data-id="${target}"]`) : null;
    if (!el || window.matchMedia("(max-width: 860px)").matches) {
      gsap.to(p, { opacity: 0, duration: 0.25 });
      return;
    }
    const firstShow = Number(gsap.getProperty(p, "opacity")) === 0;
    gsap.to(p, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: firstShow ? 0 : 0.45,
      ease: "power3.out",
    });
    p.classList.toggle("is-cta", target === contact.id);
  }, [target]);

  const onLink = (e: MouseEvent<HTMLAnchorElement>, l: { id: string; to: string }) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(false);
    if (home) scrollToId(l.id);
    else go(l.to);
  };

  const linkProps = (l: { id: string; to: string }) => ({
    href: home ? `#${l.id}` : l.to,
    "data-id": l.id,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => onLink(e, l),
    onPointerEnter: () => setHover(l.id),
    onFocus: () => setHover(l.id),
    "aria-current": (activeId === l.id ? (home ? "location" : "page") : undefined) as "location" | "page" | undefined,
  });

  return (
    <header ref={nav} className={`nav ${home ? "nav--home" : ""} ${open ? "is-open" : ""}`}>
      <TLink to="/" className="nav__mark display" aria-label={`${site.name}, home`}>
        <Seal size="sm" />
        {site.name}
      </TLink>
      <button className="nav__toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="nav-links"
        ref={list}
        className="nav__links"
        aria-label="Main"
        onPointerLeave={() => setHover(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHover(null);
        }}
      >
        <span ref={pill} className="nav__pill" aria-hidden="true" />
        {links.map((l) => (
          <a key={l.id} className={`nav__link ${activeId === l.id ? "is-current" : ""}`} {...linkProps(l)}>
            {l.label}
          </a>
        ))}
        <a className={`nav__cta ${activeId === contact.id ? "is-current" : ""}`} {...linkProps(contact)}>
          {contact.label}
        </a>
      </nav>
    </header>
  );
}
