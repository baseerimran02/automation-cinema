import { Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Scroll reveal with configurable direction — used sparingly, never as the
   only motion on a page. */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  className,
}: {
  children: ReactNode;
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const offset =
    from === "left"
      ? { x: -40 }
      : from === "right"
        ? { x: 40 }
        : from === "scale"
          ? { scale: 0.92 }
          : { y: 28 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Number that counts up when it enters the viewport. */
export function AnimatedMetric({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn("font-display tabular-nums", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* Magnetic CTA that leans toward the cursor. */
export function MagneticLink({
  to,
  children,
  variant = "primary",
  cursor = "OPEN",
  className,
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  cursor?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      data-cursor={cursor}
      className={cn("inline-flex", className)}
    >
      <Link
        to={to}
        className={cn(
          "inline-flex items-center gap-2 rounded-md px-6 py-3 font-display text-sm font-semibold tracking-tight transition-all duration-300",
          variant === "primary"
            ? "text-primary-foreground shadow-[var(--glow-signal)] hover:shadow-[var(--glow-compute)]"
            : "border border-border text-foreground hover:border-signal/60 hover:bg-secondary/60",
        )}
        style={
          variant === "primary" ? { backgroundImage: "var(--gradient-signal)" } : undefined
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}


export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-signal/70" />
      <span className="label-mono text-signal">{children}</span>
    </div>
  );
}

export function PageHeader({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:pt-40">
      <Reveal>
        <SectionLabel>{label}</SectionLabel>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] md:text-6xl">{title}</h1>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {intro}
          </p>
        </Reveal>
      )}
      {children}
    </header>
  );
}
