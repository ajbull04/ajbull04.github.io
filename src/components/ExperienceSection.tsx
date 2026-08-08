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
    role: "Software Engineer Intern",
    company: "Impulse Space",
    location: "Los Angeles, CA",
    period: "May 2026 – Present (Part-time Remote)",
    bullets: [
      "Developed a full-stack software system to pull, manage, and visualize vehicle architecture data used by nearly all engineers company-wide",
      "Architected a platform for building and conceptualizing entire vehicle architectures, evolving to display real-time status of system components and connectivity",
      "Serve as sole developer, manager, and planner, owning all design decisions and technical direction for the system",
      "Built with TypeScript, React, Next.js, PostgreSQL, Prisma, Docker, Nginx, and GitLab CI/CD",
    ],
  },
  {
    role: "Research Assistant",
    company: "Duke University",
    location: "Durham, NC",
    period: "Aug 2025 – Present",
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
    period: "Aug 2025 – Present",
    bullets: [
      "Taught computer architecture concepts including pipelining, caching, memory hierarchy, and ISA execution to 500+ students",
      "Helped students debug programs written in C and Assembly interacting with CPU architectures and memory systems",
      "Mentored students through designing and debugging a 5-stage pipelined CPU on FPGAs for course design projects",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Persistent Systems, LLC",
    location: "New York City, NY",
    period: "May 2025 – Aug 2025",
    bullets: [
      "Removed a production bottleneck by building a Quality Control app using Java and C firmware to automate device validation",
      "Enhanced production output by achieving 6-minute device validation via Gradle application automation and optimization",
      "Improved failure analysis by extending the company SQL database to capture device telemetry and production error codes",
      "Enhanced the company-wide QC app by assembling unit tests and updating the frontend to display real-time device status",
      "Improved development efficiency 50% by creating automated build and deployment bash scripts for the QC system",
    ],
  },
  {
    role: "Computer Engineering Intern",
    company: "Federal Aviation Administration",
    location: "Atlantic City, NJ",
    period: "May 2024 – Aug 2024",
    bullets: [
      "Reduced test duration by 66% for a national tool by leading the creation of simulations using a proprietary FAA framework",
      "Enhanced data processing by 500% by introducing multithreading and parallel processing using the C POSIX library",
      "Prototyped an initial Artificial Intelligence model for automating testing and evaluation within the FAA",
      "Reduced time spent outside of lab by 50% by deploying Python automation scripts for testing workflows",
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
