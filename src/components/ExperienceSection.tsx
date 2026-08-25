import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const education = {
  school: "Duke University",
  subtitle: "Durham, NC · May 2027",
  headline: "MEng Software Engineering · BSE Electrical & Computer Engineering, Computer Science",
  bullets: [
    "Cumulative GPA: 3.7/4.0",
    "Coursework includes algorithms, database systems, computer architecture, networks, operating systems, distributed systems, and software engineering",
    "Campus involvement: Computer Architecture TA, IEEE, NSBE, Collegiate 100 Black Men, Club Basketball officer, Coach2Inspire volunteer",
  ],
};

const experiences = [
  {
    role: "Software Engineering Intern",
    company: "Impulse Space",
    location: "Los Angeles, CA",
    period: "May 2026 – Present",
    bullets: [
      "Architected and developed a company-wide platform for visualizing, configuring, and managing aerospace vehicle architectures, reducing production engineering workflow time by 86%, from 14 hours to 2 hours.",
      "Built an interactive graph-based interface with TypeScript, React, and React Flow and designed a PostgreSQL-backed service layer using Prisma.",
      "Containerized and deployed the application with Docker, Next.js, and Nginx, using GitLab CI/CD and webhooks to automate build and deployment workflows.",
      "Developed Python integration pipelines that ingest and transform engineering data from CAD systems and internal APIs.",
    ],
  },
  {
    role: "Research Assistant",
    company: "Duke University",
    location: "Durham, NC",
    bullets: [
      "Developed firmware to capture and analyze data from muscles for biometric devices using C, nRF SDK, and Zephyr RTOS",
      "Enabled device-to-device data transfer by implementing Bluetooth Low Energy (BLE) communication using C++",
      "Accelerated biometric data analysis by building pipelines to process datasets collected from embedded sensors",
    ],
  },
  {
    role: "Digital Design Teaching Assistant",
    company: "Duke University",
    location: "Durham, NC",
    period: "Jan 2026 - Present",
    bullets: [
      "Taught computer architecture topics—pipelining, caching, memory hierarchy, ISA execution—to 500+ students",
      "Debugged student programs in C and Assembly on CPU and memory models",
      "Mentored 5-stage pipelined CPU design projects on FPGAs",
    ],
  },
  {
    role: "Computer Architecture Teaching Assistant",
    company: "Duke University",
    location: "Durham, NC",
    period: "Aug 2025 - Jan 2026",
    bullets: [
      "Taught computer architecture concepts including pipelining, caching, memory hierarchy, and ISA execution to 500+ students",
      "Helped students debug programs written in C and Assembly interacting with CPU architectures and memory systems",
      "Mentored students through designing and debugging a 5-stage pipelined CPU on FPGAs for course design projects",
    ],
  },
  {
    company: "Persistent Systems, LLC",
    location: "New York, NY",
    period: "May 2025 – Aug 2025",
    bullets: [
      "Developed a Gradle-packaged Java Quality Control application that integrated C device firmware with Amazon RDS for SQL Server through JDBC, removing a production bottleneck and enabling military-device shipments.",
      "Standardized error-code reporting across all device QC applications and extended Amazon RDS for SQL Server to store validation metrics from the new device.",
      "Implemented asynchronous device validation with Java SwingWorker, preventing UI freezes and displaying real-time status.",
      "Reduced validation time for a new device QC application by 50%, from 12 to 6 minutes, through workflow optimization.",
      "Expanded unit-test coverage and standardized application builds with Bash scripts, reducing build time by 50% while preventing database configuration errors.",
    ],
  },
  {
    role: "Computer Engineering Intern",
    company: "Federal Aviation Administration",
    location: "Atlantic City, NJ",
    period: "May 2024 – Aug 2024",
    bullets: [
      "Led development of simulations for an FAA evaluation platform, reducing test execution time by 66%.",
      "Increased data-processing throughput to 5x its previous rate by implementing multithreading and parallel execution using C++ and POSIX threads.",
      "Developed and deployed Python automation scripts integrating FAA APIs, reducing required in-lab testing time by 50%.",
    ],
  },
];

const ExperienceSection = () => (
  <section id="experience" className="border-y border-ink/15 bg-paper-deep/60 px-6 py-28 lg:px-10">
    <div className="container mx-auto">
      <SectionHeading index="03" label="Track record" title="Where I've built, taught, and shipped." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="group grid gap-4 border-t border-ink/20 py-8 md:grid-cols-[190px_1fr] md:gap-10">
          <p className="label-mono pt-1.5 text-muted-foreground">{education.subtitle}</p>
          <div className="space-y-3">
            <h3 className="font-display text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
              {education.school}
            </h3>
            <p className="max-w-2xl font-mono text-sm text-primary">{education.headline}</p>
            <ul className="max-w-2xl list-disc space-y-2 pl-5 font-body leading-relaxed text-muted-foreground">
              {education.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        {experiences.map((exp) => (
          <div
            key={`${exp.company}-${exp.role}-${exp.period}`}
            className="group grid gap-4 border-t border-ink/20 py-8 md:grid-cols-[190px_1fr] md:gap-10"
          >
            <p className="label-mono pt-1.5 text-muted-foreground">{exp.period}</p>
            <div className="space-y-3">
              <h3 className="font-display text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                {exp.role}
              </h3>
              <p className="font-mono text-sm text-primary">
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              <ul className="max-w-2xl list-disc space-y-2 pl-5 font-body leading-relaxed text-muted-foreground">
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ExperienceSection;
