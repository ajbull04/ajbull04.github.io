import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArchitectureTier } from "@/data/projects";

interface ArchitectureDiagramProps {
  tiers: ArchitectureTier[];
  notes?: string[];
}

const COLUMNS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const ArchitectureDiagram = ({ tiers, notes }: ArchitectureDiagramProps) => (
  <div className="border border-ink/15 bg-paper-deep/40 p-5 sm:p-8">
    {tiers.map((tier, tierIndex) => (
      <div key={tier.label}>
        <p className="label-mono text-muted-foreground">{tier.label}</p>
        <div className={cn("mt-2 grid gap-3", COLUMNS[tier.nodes.length] ?? COLUMNS[3])}>
          {tier.nodes.map((node) => (
            <div key={node.name} className="border border-ink/25 bg-card px-4 py-3">
              <p className="font-display text-sm font-bold text-foreground">{node.name}</p>
              {node.detail && <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">{node.detail}</p>}
            </div>
          ))}
        </div>
        {tierIndex < tiers.length - 1 && (
          <div className="flex flex-col items-center py-3" aria-hidden>
            <span className="h-5 w-px bg-ink/25" />
            <ChevronDown className="h-3 w-3 text-ink/40" />
          </div>
        )}
      </div>
    ))}

    {notes && notes.length > 0 && (
      <ul className="mt-8 space-y-2 border-t border-ink/15 pt-4">
        {notes.map((note) => (
          <li key={note} className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            — {note}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ArchitectureDiagram;
