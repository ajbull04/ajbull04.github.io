import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProjects } from "@/data/projects";
import FeaturedProject from "@/components/FeaturedProject";
import SectionHeading from "@/components/SectionHeading";

const ProjectsSection = () => {
  const featured = getFeaturedProjects();

  return (
    <section id="projects" className="px-6 py-28 lg:px-10">
      <div className="container mx-auto">
        <SectionHeading
          index="02"
          label="Built"
          title="Things I've designed, shipped, and kept improving."
          action={
            <Link
              to="/projects"
              className="no-print group inline-flex shrink-0 items-center gap-2 border border-ink/30 px-6 py-3 font-display text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              View all projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />

        <div>
          {featured.map((project, i) => (
            <FeaturedProject key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
