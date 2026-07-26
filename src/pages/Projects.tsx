import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import {
  PROJECT_CATEGORIES,
  filterProjectsByCategories,
  type ProjectCategory,
} from "@/data/projects";
import { cn } from "@/lib/utils";

const chipClass = (active: boolean) =>
  cn(
    "label-mono border px-4 py-2.5 transition-colors duration-200",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-ink/25 text-muted-foreground hover:border-primary hover:text-primary",
  );

const Projects = () => {
  const [selected, setSelected] = useState<ProjectCategory[]>([]);

  const filtered = useMemo(() => filterProjectsByCategories(selected), [selected]);

  const toggleCategory = (category: ProjectCategory) => {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const clearFilters = () => setSelected([]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-28 pt-32 lg:px-10">
        <Link
          to="/#projects"
          className="label-mono inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 border-t border-ink/25 pt-6"
        >
          <p className="label-mono text-primary">Everything</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-[0.95] text-foreground md:text-6xl">
            Every project, filed by what it is.
          </h1>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-3">
          <motion.button
            type="button"
            onClick={clearFilters}
            whileTap={{ scale: 0.95 }}
            className={chipClass(selected.length === 0)}
          >
            All
          </motion.button>
          {PROJECT_CATEGORIES.map((category) => (
            <motion.button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              whileTap={{ scale: 0.95 }}
              className={chipClass(selected.includes(category))}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <p className="label-mono mt-6 text-muted-foreground/80">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8 border border-ink/20 bg-card/50 px-8 py-16 text-center">
            <p className="mb-6 font-body text-muted-foreground">No projects match the selected filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="border border-ink/30 px-6 py-3 font-display text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
