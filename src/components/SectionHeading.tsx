import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  action?: ReactNode;
}

const SectionHeading = ({ index, label, title, action }: SectionHeadingProps) => (
  <div className="mb-14">
    <div className="flex items-center gap-4 border-t border-ink/20 pt-3">
      <span className="label-mono text-primary">{index}</span>
      <span className="label-mono text-muted-foreground">{label}</span>
    </div>
    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground max-w-2xl">{title}</h2>
      {action}
    </div>
  </div>
);

export default SectionHeading;
