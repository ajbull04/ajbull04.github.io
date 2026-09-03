import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: index * 0.06 }}
  >
    <Link
      to={`/project/${project.slug}`}
      className="group flex h-full flex-col border border-ink/20 bg-card/60 transition-colors duration-300 hover:border-primary"
    >
      <div className="overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          width={800}
          height={600}
          className="h-52 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="label-mono text-primary">{project.categories.join(" · ")}</p>
        <h3 className="flex items-start justify-between gap-3 font-display text-xl font-bold text-foreground">
          {project.title}
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </h3>
        <p className="flex-1 font-body leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2" aria-label="Tools used">
          {project.stack.slice(0, 5).map((tool) => (
            <span key={tool} className="border border-ink/20 px-2 py-1 font-mono text-[10px] text-muted-foreground">
              {tool}
            </span>
          ))}
          {project.stack.length > 5 && (
            <span className="px-1 py-1 font-mono text-[10px] text-muted-foreground">+{project.stack.length - 5}</span>
          )}
        </div>
        <p className="label-mono text-muted-foreground/80">{project.timeline}</p>
      </div>
    </Link>
  </motion.div>
);

export default ProjectCard;
