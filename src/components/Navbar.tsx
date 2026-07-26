import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { EMAIL, RESUME_URL } from "@/lib/links";

const navItems = [
  { label: "Live", id: "workbench" },
  { label: "Work", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goToSection = (id: string) => {
    setOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate(`/#${id}`);
  };

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="no-print fixed top-0 left-0 right-0 z-50 border-b border-ink/15 bg-paper/85 backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        <button
          onClick={() => (location.pathname === "/" ? window.scrollTo({ top: 0, behavior: "smooth" }) : navigate("/"))}
          className="flex items-center gap-2.5 text-left"
        >
          <span className="h-3 w-3 bg-primary" />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">Aaron Bullock</span>
        </button>

        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className="label-mono text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Résumé
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="label-mono border border-ink/30 px-4 py-2 text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
          >
            Email me
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-ink/15 px-6 pb-5 pt-3 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className="label-mono py-2 text-left text-muted-foreground"
            >
              {item.label}
            </button>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono py-2 text-muted-foreground"
          >
            Résumé
          </a>
          <a href={`mailto:${EMAIL}`} className="label-mono py-2 text-primary">
            Email me
          </a>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
