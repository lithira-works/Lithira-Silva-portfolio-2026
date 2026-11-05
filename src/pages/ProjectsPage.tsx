import { PageTitle } from "@/components/layout/PageTitle";
import { Projects } from "@/sections/Projects";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ProjectsPage() {
  usePageTitle("Projects");
  return (
    <>
      <PageTitle title="Projects" intro="A selection of my work, from an AI video tool to a home services marketplace. There is more on my GitHub." />
      <Projects />
    </>
  );
}
