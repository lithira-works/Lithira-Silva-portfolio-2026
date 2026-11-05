import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useReveal } from "@/hooks/useReveal";
import KoiPond from "@/components/three/KoiPond";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".footer__name",
          { yPercent: 70 },
          {
            yPercent: 30,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  const year = new Date().getFullYear();
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}`;

  return (
    <footer ref={root} className="footer" data-ground="dark">
      <KoiPond className="footer__pond" count={5} interactive={false} label="Koi swimming under the footer" />
      <div className="footer__veil" aria-hidden="true" />
      <div className="footer__top">
        <div className="footer__invite">
          <p className="footer__line display" data-split>
            Got a project?
            <br />
            Let&rsquo;s swim.
          </p>
          <div data-reveal>
            <Button href={mail} tone="light">
              Email me
            </Button>
          </div>
        </div>
        <ul className="footer__links" data-reveal>
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="footer__link">
                <SocialIcon name={s.label} />
                {s.label}
              </a>
            </li>
          ))}
          <li className="footer__contact">
            <a href={`mailto:${site.email}`} className="footer__link">
              {site.email}
            </a>
            <CopyEmail />
          </li>
        </ul>
      </div>

      <div className="footer__legal small">
        <p>
          &copy; {year} {site.name} ({site.handle}). All rights reserved.
        </p>
        <details className="credits">
          <summary>Image credits</summary>
          <p>
            Prints by{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Two_carp_in_a_cascade.jpg">Hokusai</a>,{" "}
            <a href="https://commons.wikimedia.org/wiki/File:%E9%AF%89%E3%81%AE%E6%BB%9D%E7%99%BB%E3%82%8A-Red_Carp_Ascending_a_Waterfall_MET_DP139052.jpg">Gakutei</a>,{" "}
            <a href="https://commons.wikimedia.org/wiki/File:%27Carp_Splashing_Upstream%27_by_Shibata_Zeshin,_woodblock,_Honolulu_Museum_of_Art,_17107.JPG">Zeshin</a> and{" "}
            <a href="https://commons.wikimedia.org/wiki/File:MET_DP143437.jpg">Hokkei</a>, public domain via Wikimedia Commons.
          </p>
          <p>
            Oddjob screenshots show adapted photos by{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Storm_Damage_-_Broken_Fence_(17464953456).jpg">Tony Webster</a>{" "}
            (<a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>) and{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Dripping_tap_water_(2013).jpg">Karthik916</a>{" "}
            (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>).
          </p>
        </details>
      </div>

      <div className="footer__crop" aria-hidden="true">
        <span className="footer__name display">{site.name}</span>
      </div>
    </footer>
  );
}
