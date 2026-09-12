import type { Project } from "@/data/projects";

interface ProjectCoverProps {
  project: Project;
  className: string;
  loading?: "eager" | "lazy";
  videoControls?: boolean;
}

const ProjectCover = ({ project, className, loading = "lazy", videoControls = false }: ProjectCoverProps) => {
  if (project.coverVideo) {
    return (
      <video
        className={className}
        controls={videoControls}
        autoPlay={!videoControls}
        loop={!videoControls}
        muted
        playsInline
        preload="metadata"
        aria-label={`${project.title} demonstration video`}
      >
        <source src={project.coverVideo} />
        Your browser does not support embedded video.
      </video>
    );
  }

  return <img src={project.image} alt={project.title} loading={loading} className={className} />;
};

export default ProjectCover;
