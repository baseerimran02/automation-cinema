import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { MagneticLink, PageHeader, Reveal, SectionLabel } from "./primitives";
import { services } from "@/lib/site-data";

export function ServicePage({
  slug,
  visual,
  capabilities,
  outcomes,
}: {
  slug: string;
  visual: ReactNode;
  capabilities: { title: string; body: string }[];
  outcomes: string[];
}) {
  const service = services.find((s) => s.slug === slug)!;
  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="relative">
      <PageHeader label={service.motion} title={service.title} intro={service.body}>
        <div className="mt-12">{visual}</div>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <Reveal>
          <SectionLabel>Capabilities</SectionLabel>
        </Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border/60 md:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06} from={i % 2 ? "right" : "left"}>
              <div className="h-full bg-card p-7">
                <div className="label-mono">0{i + 1}</div>
                <h3 className="mt-3 text-lg">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <Reveal>
          <SectionLabel>Outcomes</SectionLabel>
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-3">
          {outcomes.map((o) => (
            <span
              key={o}
              className="rounded-full border border-signal/30 bg-signal/5 px-4 py-2 text-sm text-foreground"
            >
              {o}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="panel flex flex-col items-start justify-between gap-6 p-10 md:flex-row md:items-center">
          <h2 className="max-w-lg text-2xl md:text-3xl">
            Ready to see this running inside your business?
          </h2>
          <MagneticLink to="/contact" cursor="RUN">
            Book a Free Audit <ArrowRight className="h-4 w-4" />
          </MagneticLink>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              to={o.to}
              data-cursor="OPEN"
              className="group panel p-6 transition-colors hover:border-signal/50"
            >
              <div className="label-mono">{o.motion}</div>
              <div className="mt-3 flex items-center justify-between text-sm">
                {o.title}
                <ArrowRight className="h-4 w-4 -translate-x-1 text-signal opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
