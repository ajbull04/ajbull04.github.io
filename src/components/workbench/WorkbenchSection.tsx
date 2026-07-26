import { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";

const DeviceConsole = lazy(() => import("./DeviceConsole"));
const QueryLatencyLab = lazy(() => import("./QueryLatencyLab"));

const demos = [
  {
    id: "device",
    label: "Device link",
    caption: "BLE stream + EMG capture — from my biometric firmware research at Duke",
  },
  {
    id: "query",
    label: "Query latency",
    caption: "Postgres index tuning — the 100 ms to sub-1 ms work on Trybl",
  },
] as const;

type DemoId = (typeof demos)[number]["id"];

const PanelFallback = () => (
  <div className="flex h-[520px] items-center justify-center border border-ink/15 bg-paper-deep/40">
    <p className="label-mono text-muted-foreground">Loading module…</p>
  </div>
);

const WorkbenchSection = () => {
  const [active, setActive] = useState<DemoId>("device");
  const activeDemo = demos.find((demo) => demo.id === active)!;

  return (
    <section id="workbench" className="border-b border-ink/15 px-6 py-28 lg:px-10">
      <div className="container mx-auto">
        <SectionHeading index="01" label="Live" title="Two systems I built, running in your browser." />

        <p className="-mt-6 mb-10 max-w-2xl font-body leading-relaxed text-muted-foreground">
          Not screenshots. These are working simulations of systems I've shipped: the BLE firmware stream from my
          biometric research, and the query planner behavior behind Trybl's database work. Same behavior, no hardware
          or server required.
        </p>

        <div className="no-print flex flex-wrap gap-3">
          {demos.map((demo) => (
            <motion.button
              key={demo.id}
              type="button"
              onClick={() => setActive(demo.id)}
              whileTap={{ scale: 0.95 }}
              aria-pressed={active === demo.id}
              className={cn(
                "label-mono border px-4 py-2.5 transition-colors duration-200",
                active === demo.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-ink/25 text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {demo.label}
            </motion.button>
          ))}
        </div>

        <p className="mt-4 font-mono text-sm text-muted-foreground">{activeDemo.caption}</p>

        <div className="no-print mt-6">
          <Suspense fallback={<PanelFallback />}>
            {active === "device" ? <DeviceConsole /> : <QueryLatencyLab />}
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default WorkbenchSection;
