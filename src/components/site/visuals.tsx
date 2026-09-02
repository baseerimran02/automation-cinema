import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Cloud,
  Database,
  GitBranch,
  Layers,
  LineChart,
  Plug,
  Search,
  Sparkles,
} from "lucide-react";

/* ================================================================
 * Page-specific motion systems. Each page gets its own language.
 * ================================================================ */

/* SERVICES — architecture assembles itself on scroll */
export function ArchitectureAssembly() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const spread = useTransform(scrollYProgress, [0, 0.5], [140, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <div ref={ref} className="relative h-[320px] w-full overflow-hidden rounded-lg border border-border">
      <div className="grid-floor absolute inset-0 opacity-70" />
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          style={{ y: useTransform(spread, (v) => v * (i - 1.5) * 0.6), opacity }}
          className="absolute left-1/2 top-1/2 h-24 w-64 -translate-x-1/2 -translate-y-1/2 rounded-md border border-signal/40 bg-surface-2/70 backdrop-blur-sm"
          animate={{ rotateX: [0, 2, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex h-full items-center justify-between px-4">
            <span className="label-mono">Layer 0{i + 1}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-node" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* AI AGENTS — agents activate and exchange messages */
export function AgentNetwork() {
  const agents = [
    { x: 20, y: 30, name: "Intake" },
    { x: 50, y: 15, name: "Qualify" },
    { x: 80, y: 32, name: "Respond" },
    { x: 68, y: 72, name: "Schedule" },
    { x: 30, y: 74, name: "Escalate" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % agents.length), 1800);
    return () => clearInterval(id);
  }, [agents.length]);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-surface/60">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {agents.map((a, i) => {
          const b = agents[(i + 1) % agents.length]!;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--signal)"
              strokeWidth="0.25"
              strokeDasharray="2 2"
              opacity={active === i ? 0.9 : 0.25}
              className="animate-flow"
            />
          );
        })}
      </svg>
      {agents.map((a, i) => (
        <motion.div
          key={a.name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${a.x}%`, top: `${a.y}%` }}
          animate={{ scale: active === i ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          data-cursor="CONNECT"
        >
          <div
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs backdrop-blur-sm transition-colors ${
              active === i
                ? "border-signal/70 bg-signal/10 text-foreground shadow-[var(--glow-signal)]"
                : "border-border bg-surface-2/70 text-muted-foreground"
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            {a.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* WORKFLOW AUTOMATION — packets travel through the pipeline */
const FLOW_STEPS = ["Lead", "AI Agent", "Qualify", "CRM", "Response", "Task", "Analytics"];

export function WorkflowEngine({ steps = FLOW_STEPS }: { steps?: string[] }) {
  const [head, setHead] = useState(-1);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setHead((h) => (h + 1) % (steps.length + 2)), 900);
    return () => clearInterval(id);
  }, [running, steps.length]);

  const state = (i: number) =>
    head === i ? "PROCESSING" : head > i ? "SUCCESS" : "IDLE";

  return (
    <div className="panel p-6">
      <div className="mb-6 flex items-center justify-between">
        <span className="label-mono">Workflow engine</span>
        <button
          data-cursor="RUN"
          onClick={() => setRunning((v) => !v)}
          className="rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:border-signal/60 hover:text-signal"
        >
          {running ? "Pause" : "Run"}
        </button>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-3">
            <motion.div
              animate={{
                borderColor:
                  state(i) === "PROCESSING"
                    ? "var(--signal)"
                    : state(i) === "SUCCESS"
                      ? "var(--compute)"
                      : "var(--border)",
                scale: state(i) === "PROCESSING" ? 1.05 : 1,
              }}
              className="flex-1 rounded-md border bg-surface-2/60 px-3 py-3 text-center"
            >
              <div className="text-xs font-medium">{s}</div>
              <div className="label-mono mt-1 text-[9px]">{state(i)}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="relative hidden h-px w-6 bg-border md:block">
                {head === i && (
                  <motion.span
                    className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-signal"
                    initial={{ left: 0 }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 0.85, ease: "linear" }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* DATA ENGINEERING — raw data becomes structured intelligence */
export function DataStreamVisual() {
  const cols = 34;
  return (
    <div className="relative h-[300px] overflow-hidden rounded-lg border border-border bg-surface/60">
      <div className="absolute inset-0 flex items-end gap-1 px-4 pb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ backgroundImage: "var(--gradient-signal)" }}
            animate={{ height: [`${10 + (i % 5) * 6}%`, `${30 + ((i * 7) % 55)}%`, `${12 + (i % 4) * 8}%`] }}
            transition={{ duration: 3 + (i % 6) * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-signal/10 blur-2xl" style={{ animation: "scan 6s linear infinite" }} />
      <div className="absolute left-4 top-4 label-mono">raw → parsed → normalized → warehoused</div>
    </div>
  );
}

/* CUSTOM AI — dataset to inference pipeline */
export function ModelPipeline() {
  const stages = ["Dataset", "Training", "Evaluation", "Model", "Inference", "Output"];
  return (
    <div className="grid gap-3 md:grid-cols-6">
      {stages.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.6 }}
          className="panel relative overflow-hidden p-4"
          data-cursor="TRACE"
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-px"
            style={{ backgroundImage: "var(--gradient-signal)" }}
            animate={{ scaleX: [0, 1, 0], transformOrigin: ["left", "left", "right"] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35 }}
          />
          <Layers className="h-4 w-4 text-signal" />
          <div className="mt-3 text-sm font-medium">{s}</div>
          <div className="label-mono mt-1 text-[9px]">stage 0{i + 1}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* INTEGRATION — connected ecosystem orbit */
export function IntegrationOrbit() {
  const systems = [
    { icon: Database, label: "CRM" },
    { icon: Plug, label: "API" },
    { icon: Cloud, label: "Cloud" },
    { icon: LineChart, label: "Analytics" },
    { icon: GitBranch, label: "ERP" },
    { icon: Sparkles, label: "LLM" },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
      >
        {systems.map((s, i) => {
          const a = (i / systems.length) * Math.PI * 2;
          return (
            <motion.div
              key={s.label}
              className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md border border-border bg-surface-2/80 backdrop-blur"
              style={{ left: `${50 + Math.cos(a) * 38}%`, top: `${50 + Math.sin(a) * 38}%` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
              data-cursor="CONNECT"
            >
              <s.icon className="h-4 w-4 text-signal" />
              <span className="label-mono mt-1 text-[8px]">{s.label}</span>
            </motion.div>
          );
        })}
      </motion.div>
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-signal/50 bg-signal/10 shadow-[var(--glow-signal)]">
        <span className="font-display text-xs">PRIME</span>
      </div>
      <div className="absolute inset-[12%] rounded-full border border-dashed border-border" />
    </div>
  );
}

/* AI AUDIT — radar sweep */
export function AuditRadar() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border border-border">
      {[0.75, 0.5, 0.25].map((r) => (
        <div
          key={r}
          className="absolute rounded-full border border-border/70"
          style={{ inset: `${(1 - r) * 50}%` }}
        />
      ))}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.14 194 / 28%) 60deg, transparent 90deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      {[
        [30, 40],
        [65, 30],
        [55, 70],
        [72, 62],
      ].map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal animate-node"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}
        />
      ))}
      <Search className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-signal" />
    </div>
  );
}

/* TECHNOLOGY — nodes reorganize on hover */
export function TechEcosystem({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((t, i) => (
        <motion.span
          key={t}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03 }}
          whileHover={{ y: -4, borderColor: "var(--signal)" }}
          data-cursor="TRACE"
          className="rounded-full border border-border bg-surface-2/60 px-4 py-2 font-mono text-xs text-muted-foreground"
        >
          {t}
        </motion.span>
      ))}
    </div>
  );
}

/* PROCESS — horizontal cinematic timeline driven by scroll */
export function ProcessTimeline({
  steps,
}: {
  steps: { n: string; title: string; body: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-7xl px-6">
          <div className="h-px w-full bg-border">
            <motion.div style={{ width: line }} className="h-px" >
              <div className="h-px w-full" style={{ backgroundImage: "var(--gradient-signal)" }} />
            </motion.div>
          </div>
        </div>
        <motion.div style={{ x }} className="flex gap-8 pl-6">
          {steps.map((s) => (
            <div key={s.n} className="panel w-[80vw] shrink-0 p-8 md:w-[38vw]">
              <div className="font-display text-5xl text-gradient">{s.n}</div>
              <h3 className="mt-6 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
