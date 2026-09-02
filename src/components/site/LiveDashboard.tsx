import { motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Bot, Cpu, Database, GitBranch, Play, Pause, RotateCcw, Zap } from "lucide-react";
import { AnimatedMetric } from "./primitives";

/* Illustrative dashboard — simulated telemetry, not production data. */

const FEED = [
  { icon: Bot, text: "AI agent completed qualification task", tag: "AGENT" },
  { icon: Database, text: "CRM record updated — lead score 87", tag: "CRM" },
  { icon: GitBranch, text: "Workflow executed: onboarding-v3", tag: "FLOW" },
  { icon: Zap, text: "API request completed in 240ms", tag: "API" },
  { icon: Activity, text: "Weekly performance report generated", tag: "REPORT" },
  { icon: Cpu, text: "Model inference batch processed (128)", tag: "MODEL" },
];

type Status = "OFFLINE" | "CONNECTING" | "PROCESSING" | "ACTIVE";
const STATUS_ORDER: Status[] = ["OFFLINE", "CONNECTING", "PROCESSING", "ACTIVE"];

function Sparkline({ running }: { running: boolean }) {
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: 28 }, (_, i) => 40 + Math.sin(i / 2.4) * 18 + Math.random() * 10),
  );

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setData((d) => {
        const last = d[d.length - 1] ?? 50;
        const next = Math.max(12, Math.min(96, last + (Math.random() - 0.45) * 18));
        return [...d.slice(1), next];
      });
    }, 1200);
    return () => clearInterval(id);
  }, [running]);

  const w = 100;
  const h = 40;
  const path = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (data.length - 1)) * w},${h - (v / 100) * h}`)
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-24 w-full">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#areaFill)" animate={{ d: area }} transition={{ duration: 0.9 }} />
      <motion.path
        d={path}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, d: path }}
        transition={{ pathLength: { duration: 1.6, ease: "easeOut" }, d: { duration: 0.9 } }}
      />
    </svg>
  );
}

function Radial({ value, label }: { value: number; label: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--compute)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (value / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center">
        <div className="font-display text-lg">
          <AnimatedMetric value={value} suffix="%" />
        </div>
        <div className="label-mono text-[9px]">{label}</div>
      </div>
    </div>
  );
}

function Bars({ running }: { running: boolean }) {
  const heights = useMemo(() => [46, 68, 38, 82, 57, 91, 64], []);
  return (
    <div className="flex h-24 items-end gap-2">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{ backgroundImage: "var(--gradient-signal)" }}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          animate={running ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.6 }}
          transition={{
            height: { duration: 1, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 2.4, repeat: Infinity, delay: i * 0.15 },
          }}
        />
      ))}
    </div>
  );
}

export function LiveDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<Status>("OFFLINE");
  const [feed, setFeed] = useState(() => FEED.slice(0, 3));

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i = Math.min(i + 1, STATUS_ORDER.length - 1);
      setStatus(STATUS_ORDER[i]!);
      if (i === STATUS_ORDER.length - 1) clearInterval(id);
    }, 700);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => {
    if (!running || !inView) return;
    const id = setInterval(() => {
      setFeed((f) => [FEED[Math.floor(Math.random() * FEED.length)]!, ...f].slice(0, 5));
    }, 2600);
    return () => clearInterval(id);
  }, [running, inView]);

  const reset = () => {
    setFeed(FEED.slice(0, 3));
    setStatus("CONNECTING");
    setTimeout(() => setStatus("ACTIVE"), 900);
  };

  return (
    <div ref={ref} className="panel overflow-hidden">
      {/* window chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${status === "ACTIVE" ? "bg-signal animate-node" : "bg-muted-foreground"}`}
          />
          <span className="label-mono text-foreground">Automation Control · {status}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-cursor={running ? "PAUSE" : "RUN"}
            onClick={() => setRunning((v) => !v)}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:border-signal/60 hover:text-signal"
          >
            {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {running ? "Pause" : "Run system"}
          </button>
          <button
            data-cursor="RESET"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:border-signal/60 hover:text-signal"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-px bg-border/50 md:grid-cols-3">
        {[
          { label: "Active workflows", value: 128, suffix: "" },
          { label: "AI actions / hour", value: 3.2, suffix: "k", decimals: 1 },
          { label: "Avg response", value: 1.4, suffix: "s", decimals: 1 },
        ].map((m) => (
          <div key={m.label} className="bg-card px-5 py-4">
            <div className="label-mono">{m.label}</div>
            <div className="mt-1 text-2xl">
              <AnimatedMetric value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-px bg-border/50 lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="label-mono">Automation volume</span>
            <span className="text-xs text-signal">+24% vs last week</span>
          </div>
          <Sparkline running={running} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="label-mono mb-2">Workflow throughput</div>
              <Bars running={running} />
            </div>
            <div className="flex items-center justify-around">
              <Radial value={82} label="Resolution" />
              <Radial value={98} label="Uptime" />
            </div>
          </div>
        </div>

        <div className="bg-card p-5">
          <span className="label-mono">Recent activity</span>
          <div className="mt-4 flex flex-col gap-2">
            {feed.map((f, i) => (
              <motion.div
                key={`${f.tag}-${i}-${f.text}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-3 rounded-md border border-border/60 bg-surface-2/50 px-3 py-2"
              >
                <f.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" />
                <div>
                  <div className="text-xs leading-snug text-foreground">{f.text}</div>
                  <div className="label-mono text-[9px]">{f.tag}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
            Illustrative telemetry — simulated for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
