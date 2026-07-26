import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { queryShapes, resolvePlan } from "@/data/queryPlans";

const SCALE_MIN_MS = 0.1;
const SCALE_MAX_MS = 300;
const TICKS = [0.1, 1, 10, 100];

const toPercent = (ms: number) => {
  const clamped = Math.min(Math.max(ms, SCALE_MIN_MS), SCALE_MAX_MS);
  const span = Math.log10(SCALE_MAX_MS) - Math.log10(SCALE_MIN_MS);
  return ((Math.log10(clamped) - Math.log10(SCALE_MIN_MS)) / span) * 100;
};

const QueryLatencyLab = () => {
  const [shapeId, setShapeId] = useState(queryShapes[0].id);
  const [enabled, setEnabled] = useState<string[]>([]);

  const shape = queryShapes.find((item) => item.id === shapeId)!;
  const baseline = shape.plans[0];
  const plan = useMemo(() => resolvePlan(shape, enabled), [shape, enabled]);
  const speedup = baseline.ms / plan.ms;

  const selectShape = (id: string) => {
    setShapeId(id);
    setEnabled([]);
  };

  const toggleIndex = (id: string) =>
    setEnabled((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  return (
    <div className="border border-ink/15 bg-card/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 px-5 py-3">
        <p className="label-mono text-foreground">postgres 16 · trybl · {shape.table}</p>
        <p className="label-mono text-muted-foreground">{shape.tableRows.toLocaleString()} rows</p>
      </div>

      <div className="grid gap-8 p-5 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-6">
          <div>
            <p className="label-mono text-muted-foreground">Query shape</p>
            <div className="mt-2 flex flex-col gap-2">
              {queryShapes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectShape(item.id)}
                  aria-pressed={item.id === shapeId}
                  className={cn(
                    "label-mono border px-3 py-2.5 text-left transition-colors",
                    item.id === shapeId
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-ink/20 text-muted-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <pre className="overflow-x-auto border border-ink/10 bg-paper-deep/60 p-4 font-mono text-xs leading-relaxed text-foreground">
            {shape.sql.join("\n")}
          </pre>

          <div>
            <div className="flex items-baseline justify-between gap-3">
              <p className="label-mono text-muted-foreground">Indexes</p>
              <button
                type="button"
                onClick={() => setEnabled(enabled.length ? [] : shape.indexes.map((index) => index.id))}
                className="label-mono text-primary transition-opacity hover:opacity-70"
              >
                {enabled.length ? "Drop all" : "Create all"}
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {shape.indexes.map((index) => {
                const on = enabled.includes(index.id);
                return (
                  <button
                    key={index.id}
                    type="button"
                    onClick={() => toggleIndex(index.id)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full items-start gap-3 border p-3 text-left transition-colors",
                      on ? "border-primary/60 bg-primary/5" : "border-ink/15 hover:border-ink/35",
                    )}
                  >
                    <span className={cn("mt-1 h-3 w-3 shrink-0 border", on ? "border-primary bg-primary" : "border-ink/35")} />
                    <span>
                      <span className="block font-mono text-xs leading-relaxed text-foreground">{index.ddl}</span>
                      <span className="mt-1 block font-mono text-[11px] leading-relaxed text-muted-foreground">
                        {index.note}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="label-mono text-muted-foreground">Execution time</p>
              <p className="font-mono text-sm text-muted-foreground">
                {speedup >= 1.05 ? `${speedup.toFixed(speedup >= 10 ? 0 : 1)}× faster than no indexes` : "baseline"}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="label-mono text-muted-foreground">No indexes</span>
                  <span className="font-mono text-sm text-muted-foreground">{baseline.ms.toFixed(2)} ms</span>
                </div>
                <div className="mt-1.5 h-3 bg-paper-deep">
                  <div className="h-full bg-ink/25" style={{ width: `${toPercent(baseline.ms)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="label-mono text-primary">Current selection</span>
                  <span className="font-mono text-sm text-foreground">{plan.ms.toFixed(2)} ms</span>
                </div>
                <div className="mt-1.5 h-3 bg-paper-deep">
                  <motion.div
                    className="h-full bg-primary"
                    animate={{ width: `${toPercent(plan.ms)}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <div className="relative h-4">
                {TICKS.map((tick) => {
                  const position = toPercent(tick);
                  return (
                    <span
                      key={tick}
                      className={cn(
                        "absolute font-mono text-[10px] text-muted-foreground/70",
                        position > 4 && "-translate-x-1/2",
                      )}
                      style={{ left: `${position}%` }}
                    >
                      {tick} ms
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 border-t border-ink/20 pt-4 sm:grid-cols-3">
            <div>
              <dt className="label-mono text-muted-foreground">Rows scanned</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">{plan.rowsScanned.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="label-mono text-muted-foreground">Rows returned</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">{plan.rowsReturned.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="label-mono text-muted-foreground">Access path</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">{plan.node}</dd>
            </div>
          </dl>

          <motion.pre
            key={plan.node}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto border border-ink/10 bg-paper-deep/60 p-4 font-mono text-[11px] leading-relaxed text-foreground"
          >
            {plan.lines.join("\n")}
          </motion.pre>

          <p className="border-l-2 border-primary pl-4 font-body leading-relaxed text-muted-foreground">
            {plan.takeaway}
          </p>

          <p className="label-mono text-muted-foreground/70">
            Plans and timings modeled on the real optimization, replayed from static data — no database is running here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QueryLatencyLab;
