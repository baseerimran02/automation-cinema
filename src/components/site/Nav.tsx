import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const services = [
  { to: "/services/ai-agents", label: "AI Agents & Chatbots" },
  { to: "/services/workflow-automation", label: "Workflow Automation" },
  { to: "/services/data-engineering", label: "Data Pipeline Engineering" },
  { to: "/services/custom-ai", label: "Custom AI Models" },
  { to: "/services/integration", label: "AI System Integration" },
  { to: "/services/ai-audit", label: "AI Audit & Optimization" },
];

const links = [
  { to: "/services", label: "Services" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/process", label: "Process" },
  { to: "/technology", label: "Technology" },
  { to: "/about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-3" data-cursor="HOME">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-md border border-signal/50" />
            <span className="absolute inset-0 rounded-md bg-signal/10 animate-node" />
            <span className="font-display text-sm font-bold text-signal">P</span>
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">
            PRIME <span className="text-muted-foreground">AUTOMATION</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setMenu(true)}
            onMouseLeave={() => setMenu(false)}
          >
            <Link
              to="/services"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              data-cursor="EXPLORE"
            >
              Services <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="panel absolute left-0 top-full w-72 overflow-hidden p-2"
                >
                  {services.map((s, i) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      data-cursor="OPEN"
                      className="group flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
                    >
                      <span>{s.label}</span>
                      <span className="label-mono text-[9px] opacity-0 transition-opacity group-hover:opacity-100">
                        0{i + 1}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-cursor="OPEN"
              className="relative rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            data-cursor="RUN"
            className="hidden rounded-md px-4 py-2 font-display text-sm font-semibold text-primary-foreground shadow-[var(--glow-signal)] transition-shadow hover:shadow-[var(--glow-compute)] sm:inline-flex"
            style={{ backgroundImage: "var(--gradient-signal)" }}
          >
            Book a Free Audit
          </Link>
          <button
            className="rounded-md border border-border p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {[...links, ...services, { to: "/contact", label: "Contact" }].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm text-muted-foreground"
                  activeProps={{ className: "text-signal" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="grid-floor pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-lg font-semibold">PRIME AUTOMATION</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI systems. Automated workflows. Intelligent infrastructure. We engineer custom
            automation that eliminates bottlenecks and scales operations.
          </p>
        </div>
        <div>
          <div className="label-mono">Services</div>
          <div className="mt-4 flex flex-col gap-2">
            {services.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="text-sm text-muted-foreground transition-colors hover:text-signal"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="label-mono">Company</div>
          <div className="mt-4 flex flex-col gap-2">
            {[...links.slice(1), { to: "/contact", label: "Contact" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground transition-colors hover:text-signal"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-2 border-t border-border px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Prime Automation. All rights reserved.</span>
        <span className="label-mono">System status — operational</span>
      </div>
    </footer>
  );
}
