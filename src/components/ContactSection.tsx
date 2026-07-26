import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { EMAIL, LINKEDIN, PHONE_DISPLAY, PHONE_TEL, RESUME_URL } from "@/lib/links";

const channels = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "LinkedIn", value: "in/ajbull426", href: LINKEDIN },
  { label: "Phone", value: PHONE_DISPLAY, href: PHONE_TEL },
  { label: "Résumé", value: "resume.pdf", href: RESUME_URL },
];

const ContactSection = () => (
  <section id="contact" className="px-6 py-28 lg:px-10">
    <div className="container mx-auto">
      <SectionHeading index="05" label="Get in touch" title="Got something you want built? Let's talk." />

      <div className="grid gap-14 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="space-y-6 lg:col-span-7"
        >
          <p className="font-body text-xl leading-relaxed text-foreground">
            I'm looking for software engineering roles where I can work on real products — backend, full-stack, mobile,
            or systems. If that sounds like your team, I'd love to connect.
          </p>
          <p className="font-body leading-relaxed text-muted-foreground">
            Even if you just want to talk through a problem, explore other opportunities, or reach out about something
            else, I'm interested. Send it over.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="no-print group inline-flex items-center gap-3 bg-ink px-7 py-4 font-display text-sm font-semibold text-paper transition-colors duration-300 hover:bg-primary"
          >
            Email me
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <div className="lg:col-span-5">
          <dl className="divide-y divide-ink/15 border-t border-ink/25">
            {channels.map((channel) => (
              <div key={channel.label} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="label-mono text-muted-foreground">{channel.label}</dt>
                <dd>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                  >
                    {channel.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-24 flex flex-col items-start justify-between gap-3 border-t border-ink/20 pt-6 md:flex-row md:items-center">
        <p className="label-mono text-muted-foreground">© 2026 Aaron Bullock</p>
        <p className="label-mono text-muted-foreground">Duke University · Software Engineering</p>
      </div>
    </div>
  </section>
);

export default ContactSection;
