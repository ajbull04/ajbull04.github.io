import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import projects from "@/data/projects";

const SubHeading = ({ children }: { children: string }) => (
  <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{children}</h2>
);

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground">Project not found</h1>
          <Link to="/projects" className="font-body text-primary hover:underline">Back to all projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print sticky top-0 z-50 border-b border-ink/15 bg-paper/85 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-6 px-6 py-4 lg:px-10">
          <Link to="/projects" className="label-mono inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> All projects
          </Link>
          <Link to="/" className="label-mono text-muted-foreground transition-colors hover:text-primary">Home</Link>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-28 pt-16 lg:px-10">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <p className="label-mono border-t border-ink/25 pt-4 text-primary">{project.categories.join(" · ")}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[0.95] text-foreground md:text-6xl">{project.title}</h1>
          <p className="label-mono mt-5 text-muted-foreground">{project.role} · {project.timeline}</p>
        </motion.header>

        <div className="mt-10 border border-ink/10 bg-paper-deep/70">
          <img src={project.image} alt={project.title} className="max-h-[62vh] w-full object-contain p-6" />
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <section className="space-y-4">
              <SubHeading>Overview</SubHeading>
              <p className="font-body text-lg leading-relaxed text-foreground md:text-xl">{project.longDescription}</p>
            </section>

            <section>
              <SubHeading>Key contributions</SubHeading>
              <dl className="mt-4 divide-y divide-ink/15 border-t border-ink/25">
                {project.highlights.map((highlight, index) => (
                  <div key={highlight} className="flex gap-5 py-4">
                    <dt className="label-mono pt-1 text-primary">{String(index + 1).padStart(2, "0")}</dt>
                    <dd className="font-body leading-relaxed text-muted-foreground">{highlight}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {project.details?.map((section) => (
              <section key={section.title} className="space-y-4">
                <SubHeading>{section.title}</SubHeading>
                <p className="font-body leading-relaxed text-muted-foreground">{section.content}</p>
              </section>
            ))}
          </div>

          <aside className="lg:col-span-5">
            <div className="border-t border-ink/25 py-4">
              <p className="label-mono text-muted-foreground">Tools used</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tool) => (
                  <span key={tool} className="border border-ink/20 px-3 py-1.5 font-mono text-xs text-foreground">{tool}</span>
                ))}
              </div>
            </div>

            {(project.liveUrl || project.repoUrl) && (
              <div className="no-print mt-8 flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-ink px-5 py-3 font-display text-sm font-semibold text-paper transition-colors hover:bg-primary">
                    <ExternalLink className="h-4 w-4" /> Live site
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-ink/30 px-5 py-3 font-display text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
                    <Github className="h-4 w-4" /> Source code
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>

        {project.images && project.images.length > 0 && (
          <section className="mt-20">
            <SubHeading>Project gallery</SubHeading>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {project.images.map((image) => (
                <figure key={image.src} className="border border-ink/15 bg-paper-deep/50 p-4">
                  <img src={image.src} alt={image.alt} loading="lazy" className="w-full object-contain" />
                  {image.caption && <figcaption className="mt-3 font-body text-sm text-muted-foreground">{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;
