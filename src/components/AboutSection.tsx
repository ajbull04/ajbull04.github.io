import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const toolkit = [
  {
    label: "Languages",
    items: "Java · Python · C / C++ · TypeScript · JavaScript · Ruby · Assembly · SQL",
  },
  {
    label: "Frameworks & runtimes",
    items: "React · Next.js · Node.js · React Native · Django · FastAPI · Flask · Express · Rails · Vue",
  },
  {
    label: "Tools & data",
    items: "Git · Docker · Kubernetes · Nomad · PostgreSQL · MongoDB · Prisma · Supabase · Kafka · Snowflake · Nginx · Vite",
  },
  {
    label: "Close to the metal",
    items: "Zephyr RTOS · nRF SDK · BLE · I²C / SPI · Verilog · FPGA · MIPS",
  },
];

const AboutSection = () => (
  <section id="about" className="px-6 py-28 lg:px-10">
    <div className="container mx-auto">
      <SectionHeading index="03" label="Who I am" title="I build because software makes almost anything improvable." />

      <div className="grid gap-14 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="space-y-6 lg:col-span-7"
        >
          <p className="font-body text-xl leading-relaxed text-foreground">
            The reason I write software is simple: it is the fastest way I know to take an idea and turn it into
            something real, then keep making it better. A sensor that needs firmware, a backend that buckles under
            load, a workflow someone still does by hand — all of it is buildable.
          </p>
          <p className="font-body leading-relaxed text-muted-foreground">
            I'm Aaron Bullock, a Duke student pursuing an MEng in Electrical and Computer Engineering with a
            concentration in Software Engineering, following a BSE in Electrical and Computer Engineering and Computer
            Science. That path let me work at both ends of the stack: low-level systems work like firmware, drivers, and
            systems programming, and the distributed systems and core infrastructure above it — the foundational layers
            behind reliable services, efficient data flow, and high-performance platforms.
          </p>
          <p className="font-body leading-relaxed text-muted-foreground">
            Outside of work, I'm drawn to competitive environments, sports, strategy games, anything with clear goals and
            measurable progress. Basketball is my favorite; otherwise I'm puzzling or tinkering on a side project. I also
            love trying new hobbies, games, or something completely unfamiliar.
          </p>

          <div className="grid gap-8 border-t border-ink/20 pt-8 sm:grid-cols-2">
            <div>
              <p className="label-mono text-primary">What you can count on</p>
              <p className="mt-2 font-body leading-relaxed text-muted-foreground">
                I fall in love with the problem, not just the solution. I don't quit when it gets hard — I keep pushing
                until we've found the most optimal answer we can ship.
              </p>
            </div>
            <div>
              <p className="label-mono text-primary">How I work</p>
              <p className="mt-2 font-body leading-relaxed text-muted-foreground">
                Build things that feel fast and stay reliable: solid abstractions, performance wins that matter, and
                tooling that makes the next engineer's day easier.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-5">
          <p className="label-mono border-t border-ink/25 pt-3 text-muted-foreground">Toolkit</p>
          <dl className="divide-y divide-ink/15">
            {toolkit.map((group) => (
              <div key={group.label} className="py-5">
                <dt className="font-display text-sm font-bold text-foreground">{group.label}</dt>
                <dd className="mt-2 font-mono text-sm leading-relaxed text-muted-foreground">{group.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
