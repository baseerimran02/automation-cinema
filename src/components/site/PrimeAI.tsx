import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

const OPTIONS = [
  { label: "Find an automation opportunity", to: "/services" },
  { label: "Which service do I need?", to: "/services" },
  { label: "Explore AI solutions", to: "/technology" },
  { label: "Show relevant case studies", to: "/case-studies" },
  { label: "Book an AI audit", to: "/contact" },
];

export function PrimeAI() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="panel mb-3 w-[19rem] overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="label-mono text-signal">Prime AI</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              <p className="font-display text-sm">How can I help?</p>
              <div className="mt-3 flex flex-col gap-1.5">
                {OPTIONS.map((o) => (
                  <Link
                    key={o.label}
                    to={o.to}
                    onClick={() => setOpen(false)}
                    data-cursor="OPEN"
                    className="rounded-md border border-border/70 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-signal/60 hover:text-foreground"
                  >
                    {o.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor="RUN"
        className="flex items-center gap-2 rounded-full border border-signal/40 bg-background/80 px-4 py-2.5 backdrop-blur-xl transition-shadow hover:shadow-[var(--glow-signal)]"
      >
        <span className="h-2 w-2 rounded-full bg-signal animate-node" />
        <span className="label-mono text-foreground">Prime AI</span>
      </button>
    </div>
  );
}
