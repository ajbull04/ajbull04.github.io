import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const proof = [
  { label: "Now", value: "Research Assistant, Duke — biometric firmware, BLE" },
  { label: "Studying", value: "MEng ECE + Software Engineering, Duke '27" },
  { label: "I build in", value: "Embedded · Backend · Distributed · Mobile · Web" },
  { label: "Shipped at", value: "Persistent Systems · FAA · Trybl" },
];

const HeroSection = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-32">
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-ink/10 lg:block" />

      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
          className="lg:col-span-8"
        >
          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.5 }}
            className="label-mono text-muted-foreground"
          >
            Software Engineer · Durham, NC
          </motion.p>

          <h1 className="mt-5 font-display text-[3.25rem] font-extrabold leading-[0.86] tracking-[-0.03em] text-foreground sm:text-7xl lg:text-[7.5rem]">
            {["Aaron", "Bullock"].map((word) => (
              <motion.span
                key={word}
                variants={{ hidden: { opacity: 0, y: "0.35em" }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="mt-8 h-[3px] w-40 bg-primary"
          />

          <motion.h2
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            className="mt-8 max-w-2xl font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl"
          >
            I build — firmware on the board, services behind it, and the product on top.
          </motion.h2>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            className="mt-5 max-w-xl font-body text-lg leading-relaxed text-muted-foreground"
          >
            Software is the closest thing we have to leverage: give me a problem and I can build the thing that solves
            it, or make the thing that already exists work better.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="group flex items-center gap-3 bg-ink px-7 py-4 font-display text-sm font-semibold text-paper transition-colors duration-300 hover:bg-primary"
            >
              See what I've built
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>
            <button
              onClick={() => scrollTo("experience")}
              className="border border-ink/30 px-7 py-4 font-display text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              Where I've worked
            </button>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="lg:col-span-4"
        >
          <dl className="divide-y divide-ink/15 border-t border-ink/25">
            {proof.map((row) => (
              <div key={row.label} className="py-4">
                <dt className="label-mono text-primary">{row.label}</dt>
                <dd className="mt-1.5 font-mono text-sm leading-snug text-muted-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </motion.aside>
      </div>
    </section>
  );
};

export default HeroSection;
