import { Suspense, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import projects from "@/data/projects";

const QueryLatencyLab = lazy(() => import("@/components/workbench/QueryLatencyLab"));

const SubHeading = ({ children }: { children: string }) => (
  <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{children}</h2>
);

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground">Project not found</h1>
          <Link to="/projects" className="font-body text-primary hover:underline">
            Back to all projects
          </Link>
        </div>
      </div>
    );
  }

  const hasLinks = Boolean(project.liveUrl || project.repoUrl);
  const study = project.caseStudy;

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print sticky top-0 z-50 border-b border-ink/15 bg-paper/85 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-6 px-6 py-4 lg:px-10">
          <Link
            to="/projects"
            className="label-mono inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All projects
          </Link>
          <Link to="/" className="label-mono text-muted-foreground transition-colors hover:text-primary">
            Home
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-28 pt-16 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label-mono border-t border-ink/25 pt-4 text-primary">{project.categories.join(" · ")}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[0.95] text-foreground md:text-6xl">
            {project.title}
          </h1>
          <p className="label-mono mt-5 text-muted-foreground">
            {project.role} · {project.timeline}
          </p>
        </motion.div>

        <div className="mt-10 border border-ink/10 bg-paper-deep/70">
          <img src={project.image} alt={project.title} className="max-h-[62vh] w-full object-contain p-6" />
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <p className="font-body text-lg leading-relaxed text-foreground md:text-xl">{project.longDescription}</p>

            {study && (
              <>
                <section className="space-y-4">
                  <SubHeading>Why it exists</SubHeading>
                  <p className="font-body leading-relaxed text-muted-foreground">{study.context}</p>
                </section>

                <section>
                  <SubHeading>Constraints</SubHeading>
                  <ul className="mt-4 divide-y divide-ink/15 border-t border-ink/25">
                    {study.constraints.map((constraint) => (
                      <li key={constraint} className="py-4 font-body leading-relaxed text-muted-foreground">
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            <section>
              <SubHeading>What I built</SubHeading>
              <dl className="mt-4 divide-y divide-ink/15 border-t border-ink/25">
                {project.highlights.map((highlight, i) => (
                  <div key={highlight} className="flex gap-5 py-4">
                    <dt className="label-mono pt-1 text-primary">{String(i + 1).padStart(2, "0")}</dt>
                    <dd className="font-body leading-relaxed text-muted-foreground">{highlight}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <dl className="divide-y divide-ink/15 border-t border-ink/25">
              <div className="py-4">
                <dt className="label-mono text-muted-foreground">Built with</dt>
                <dd className="mt-2 font-mono text-sm leading-relaxed text-foreground">{project.stack.join(" · ")}</dd>
              </div>
            </dl>

            {hasLinks && (
              <div className="no-print mt-8 flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-ink px-5 py-3 font-display text-sm font-semibold text-paper transition-colors hover:bg-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live site
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-ink/30 px-5 py-3 font-display text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Github className="h-4 w-4" />
                    Source code
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>

        {study && (
          <>
            <section className="mt-20">
              <SubHeading>How it fits together</SubHeading>
              <div className="mt-6">
                <ArchitectureDiagram tiers={study.architecture.tiers} notes={study.architecture.notes} />
              </div>
            </section>

            <section className="mt-20">
              <SubHeading>Decisions and what they cost</SubHeading>
              <div className="mt-6 border-t border-ink/25">
                {study.decisions.map((entry) => (
                  <div
                    key={entry.decision}
                    className="grid gap-5 border-b border-ink/15 py-6 md:grid-cols-[1.1fr_1fr_1fr] md:gap-8"
                  >
                    <div>
                      <p className="label-mono text-primary">Decision</p>
                      <p className="mt-2 font-display text-base font-bold leading-snug text-foreground">
                        {entry.decision}
                      </p>
                    </div>
                    <div>
                      <p className="label-mono text-muted-foreground">Why</p>
                      <p className="mt-2 font-body leading-relaxed text-muted-foreground">{entry.why}</p>
                    </div>
                    <div>
                      <p className="label-mono text-muted-foreground">What it cost</p>
                      <p className="mt-2 font-body leading-relaxed text-muted-foreground">{entry.tradeoff}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-20">
              <SubHeading>Results</SubHeading>
              <dl className="mt-6 grid gap-8 border-t border-ink/25 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                {study.results.map((result) => (
                  <div key={result.metric}>
                    <dt className="label-mono text-muted-foreground">{result.metric}</dt>
                    <dd className="mt-2 font-display text-xl font-bold leading-snug text-foreground">{result.value}</dd>
                    {result.note && (
                      <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">{result.note}</p>
                    )}
                  </div>
                ))}
              </dl>
            </section>

            {project.slug === "trybl" && (
              <section className="no-print mt-20">
                <SubHeading>Try the optimization</SubHeading>
                <p className="mt-4 max-w-2xl font-body leading-relaxed text-muted-foreground">
                  Toggle the indexes and watch the planner change its mind. This is the same lab from the home page,
                  modeled on the query plans behind the latency numbers above.
                </p>
                <div className="mt-6">
                  <Suspense
                    fallback={
                      <div className="flex h-96 items-center justify-center border border-ink/15 bg-paper-deep/40">
                        <p className="label-mono text-muted-foreground">Loading module…</p>
                      </div>
                    }
                  >
                    <QueryLatencyLab />
                  </Suspense>
                </div>
              </section>
            )}

            <section className="mt-20 max-w-3xl border-l-2 border-primary pl-6">
              <p className="label-mono text-primary">What I'd do differently</p>
              <p className="mt-3 font-body text-lg leading-relaxed text-foreground">{study.nextTime}</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;
