import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";
import { Certificates } from "@/sections/Certificates";
import { Contact } from "@/sections/Contact";
import { Marquee } from "@/components/ui/Marquee";
import { KoiGlyph } from "@/components/ui/Button";
import { usePageTitle } from "@/hooks/usePageTitle";

const words = ["Full-stack", "Mobile", "Cloud", "AI", "TypeScript", "React", "Next.js", "Android"];

export default function HomePage() {
  usePageTitle();
  return (
    <>
      <Hero />
      <div className="band-wrap">
      <Marquee className="band" speed={28} label={words.join(", ")}>
        {words.map((w) => (
          <span key={w} className="band__item display">
            {w}
            <KoiGlyph />
          </span>
        ))}
      </Marquee>
      </div>
      <About />
      <Projects featuredOnly />
      <Skills compact />
      <Certificates compact />
      <Contact />
    </>
  );
}
