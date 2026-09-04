import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/data/projects";

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

const FeaturedProject = ({ project, index }: FeaturedProjectProps) => {
  const imageFirst = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="border-t border-ink/20"
    >
      <Link
        to={`/project/${project.slug}`}
        className="group grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-12"
      >
        <div
          className={`overflow-hidden border border-ink/10 bg-paper-deep/70 lg:col-span-7 ${imageFirst ? "" : "lg:order-2"}`}
        >
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            width={1200}
            height={750}
            className="aspect-[16/10] w-full object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-baseline gap-4">
            <span className="label-mono text-primary">{String(index + 1).padStart(2, "0")}</span>
            <span className="label-mono text-muted-foreground">{project.categories.join(" · ")}</span>
          </div>
          <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-foreground lg:text-4xl">
            {project.title}
          </h3>
          <p className="mt-4 font-body text-lg leading-relaxed text-muted-foreground">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Tools used">
            {project.stack.slice(0, 6).map((tool) => (
              <span key={tool} className="border border-ink/20 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                {tool}
              </span>
            ))}
          </div>
          {project.highlights[0] && (
            <p className="mt-5 border-l-2 border-primary pl-4 font-body text-sm leading-relaxed text-foreground">
              {project.highlights[0]}
            </p>
          )}
          <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-foreground">
            <span className="relative">
              View project
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeaturedProject;
