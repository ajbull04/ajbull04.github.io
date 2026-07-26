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
    role: "Research Assistant",
    company: "Duke University",
    location: "Durham, NC",
    period: "Aug 2025 – Present",
    bullets: [
      "Developed firmware for biometric devices using C, nRF SDK, and Zephyr RTOS to capture and analyze muscle data",
      "Implemented BLE device-to-device communication in C++",
      "Created pipelines to process data from embedded sensors for faster biometric analysis",
    ],
  },
  {
    role: "Digital Design Teaching Assistant",
    company: "Duke University",
    location: "Durham, NC",
    period: "Aug 2025 - Present",
    bullets: [
      "Taught computer architecture topics—pipelining, caching, memory hierarchy, ISA execution—to 500+ students",
      "Debugged student programs in C and Assembly on CPU and memory models",
      "Mentored 5-stage pipelined CPU design projects on FPGAs",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Persistent Systems, LLC",
    location: "New York, NY",
    period: "May 2025 - Aug 2025",
    bullets: [
      "Removed a production bottleneck with a Java, Kotlin, and C firmware Quality Control app for automated device verification and validation",
      "Achieved ~6-minute device validation through Gradle automation and optimization",
      "Extended SQL schema for device telemetry and production error codes to improve failure analysis",
      "Added unit tests and real-time device status UI to the company-wide QC application",
      "Improved development efficiency by ~200% with automated build and deployment bash scripts",
    ],
  },
  {
    role: "Computer Engineering Intern",
    company: "Federal Aviation Administration",
    location: "Atlantic City, NJ",
    period: "May 2024 – Aug 2024",
    bullets: [
      "Cut test duration 66% for a national tool by leading simulations in a proprietary FAA framework",
      "Enhanced data processing by 500% by introducing multithreading and parallel processing using the C POSIX library.",
      "Prototyped an AI model for automated testing and evaluation",
      "Reduced out-of-lab time ~50% with Python automation for testing workflows",
    ],
  },
];

const ExperienceSection = () => (
  <section id="experience" className="border-y border-ink/15 bg-paper-deep/60 px-6 py-28 lg:px-10">
    <div className="container mx-auto">
      <SectionHeading index="02" label="Track record" title="Where I've built, taught, and shipped." />

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
