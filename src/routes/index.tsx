import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Bot, Cloud, Database, GitBranch, LineChart, Plug } from "lucide-react";
import { AnimatedMetric, MagneticLink, Reveal, SectionLabel } from "@/components/site/primitives";
import { LiveDashboard } from "@/components/site/LiveDashboard";
import { WorkflowEngine } from "@/components/site/visuals";
import { services, stats, caseStudies } from "@/lib/site-data";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prime Automation — AI Systems & Automated Workflows" },
      {
        name: "description",
        content:
          "We engineer custom AI systems, automated workflows and intelligent infrastructure that eliminate bottlenecks and scale operations.",
      },
      { property: "og:title", content: "Prime Automation — AI Systems & Automated Workflows" },
      {
        property: "og:description",
        content: "Custom AI agents, workflow automation and data infrastructure, engineered end to end.",
      },
    ],
  }),
  component: Home,
});

/* Cursor-driven cinematic background layer. A video asset can be dropped into
   <video src=...> later; until then the layered gradient environment renders. */
function CinematicBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const t = { x: 0, y: 0 };
    const c = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      t.x = (e.clientX / window.innerWidth - 0.5) * 2;
      t.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      c.x += (t.x - c.x) * 0.05;
      c.y += (t.y - c.y) * 0.05;
      if (ref.current) {
        ref.current.style.transform = `scale(1.12) translate3d(${c.x * -26}px, ${c.y * -18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={ref}
        className="absolute inset-0 will-change-transform"
        style={{
          background:
            "radial-gradient(60% 55% at 68% 40%, oklch(0.55 0.21 287 / 40%), transparent 70%), radial-gradient(45% 45% at 25% 65%, oklch(0.82 0.14 194 / 22%), transparent 70%), oklch(0.09 0.02 265)",
        }}
      >
        {/* Drop-in slot for a cinematic video asset:
            <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-40" src="/media/infrastructure.mp4" /> */}
      </div>
      <div className="grid-floor absolute inset-0 opacity-60" />
    </div>
  );
}

function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* ---------------- HERO — AI NETWORK ---------------- */}
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden">
        <CinematicBackdrop />
        {mounted && (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-background/10 to-background" />

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pt-24"
        >
          <div className="animate-rise">
            <SectionLabel>AI-Powered Automation Agency</SectionLabel>
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[0.98] md:text-7xl lg:text-8xl">
            We Build{" "}
            <span className="text-gradient">AI Systems</span>
            <br />
            That Run Your Business
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            From intelligent chatbots to end-to-end workflow automation, we engineer custom AI
            solutions that eliminate bottlenecks, reduce costs, and scale operations without adding
            headcount.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <MagneticLink to="/contact" cursor="RUN">
              Book a Free Audit <ArrowRight className="h-4 w-4" />
            </MagneticLink>
            <MagneticLink to="/case-studies" variant="ghost" cursor="VIEW">
              See Our Work
            </MagneticLink>
          </div>

          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl">
                  <AnimatedMetric value={s.value} suffix={s.suffix} />
                </div>
                <div className="label-mono mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="relative mx-auto w-full max-w-7xl px-6 py-28">
        <Reveal>
          <SectionLabel>What we do</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-2xl text-3xl md:text-5xl">
            End-to-End AI Automation Services
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl text-muted-foreground">
            We don't just implement tools — we architect intelligent systems tailored to your unique
            business logic.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border/60 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = [Bot, GitBranch, Database, LineChart, Plug, Cloud][i]!;
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.6 }}
                className="group relative bg-card p-7 transition-colors hover:bg-surface-2"
              >
                <Link to={s.to} data-cursor="OPEN" className="absolute inset-0 z-10" aria-label={s.title} />
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-signal/30 bg-signal/5 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Icon className="h-4 w-4 text-signal" />
                </div>
                <h3 className="mt-5 text-lg">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="label-mono mt-6 flex items-center gap-2 text-signal opacity-0 transition-opacity group-hover:opacity-100">
                  {s.motion} <ArrowRight className="h-3 w-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ---------------- CINEMATIC STATEMENT ---------------- */}
      <section className="relative overflow-hidden py-32">
        <div className="grid-floor absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Reveal from="scale">
            <h2 className="text-3xl leading-tight md:text-6xl">
              Your business generates data
              <br />
              <span className="text-muted-foreground">every second.</span>
            </h2>
          </Reveal>
          <div className="my-12 flex justify-center gap-1.5">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-signal"
                initial={{ opacity: 0.1, y: 0 }}
                whileInView={{ opacity: [0.15, 1, 0.15], y: [0, -14, 0] }}
                viewport={{ once: false }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </div>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-6xl text-gradient">Turn data into intelligence.</h2>
          </Reveal>
        </div>
      </section>

      {/* ---------------- LIVE DASHBOARD ---------------- */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <Reveal>
          <SectionLabel>Live system</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-2xl text-3xl md:text-5xl">
            Every system we ship reports on itself
          </h2>
        </Reveal>
        <div className="mt-12">
          <LiveDashboard />
        </div>
        <div className="mt-8">
          <WorkflowEngine />
        </div>
      </section>

      {/* ---------------- CASE STUDIES ---------------- */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <Reveal>
          <SectionLabel>Proven results</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 text-3xl md:text-5xl">Real outcomes. Real revenue.</h2>
        </Reveal>
        <div className="mt-12 flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border/60">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06} from="left">
              <Link
                to="/case-studies/$slug"
                params={{ slug: c.slug }}
                data-cursor="VIEW"
                className="group grid items-center gap-6 bg-card p-8 transition-colors hover:bg-surface-2 md:grid-cols-[auto_1fr_auto]"
              >
                <div className="label-mono">{c.sector}</div>
                <div>
                  <h3 className="text-xl transition-colors group-hover:text-signal">{c.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{c.body}</p>
                </div>
                <div className="font-display text-2xl text-gradient">{c.headline}</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative mx-auto w-full max-w-7xl px-6 py-28">
        <div className="panel relative overflow-hidden p-12 text-center">
          <div className="grid-floor absolute inset-0 opacity-50" />
          <div className="relative">
            <Reveal from="scale">
              <h2 className="text-3xl md:text-5xl">Activate your automation system</h2>
            </Reveal>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start with a free AI audit. We map the opportunities, size the ROI, and tell you
              straight if automation doesn't make sense.
            </p>
            <div className="mt-8 flex justify-center">
              <MagneticLink to="/contact" cursor="RUN">
                Book a Free Audit <ArrowRight className="h-4 w-4" />
              </MagneticLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
