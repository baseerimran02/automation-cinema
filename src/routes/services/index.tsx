import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { PageHeader, Reveal, SectionLabel } from "@/components/site/primitives";
import { ArchitectureAssembly } from "@/components/site/visuals";
import { services } from "@/lib/site-data";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "AI Automation Services — Prime Automation" },
      {
        name: "description",
        content:
          "AI agents, workflow automation, data pipelines, custom models, integration and AI audits — engineered as systems, not tools.",
      },
      { property: "og:title", content: "AI Automation Services — Prime Automation" },
      {
        property: "og:description",
        content: "Six engineering practices that assemble into one intelligent operating system.",
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div>
      <PageHeader
        label="System architecture"
        title={
          <>
            Six practices.
            <br />
            One intelligent system.
          </>
        }
        intro="Each service is a layer of the same architecture. Scroll and the layers assemble."
      >
        <div className="mt-12">
          <ArchitectureAssembly />
        </div>
      </PageHeader>

      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <Reveal>
          <SectionLabel>Layers</SectionLabel>
        </Reveal>
        <div className="mt-8 flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border/60">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={s.to}
                data-cursor="OPEN"
                className="group grid items-center gap-5 bg-card p-8 transition-colors hover:bg-surface-2 md:grid-cols-[6rem_1fr_10rem_2rem]"
              >
                <span className="font-display text-3xl text-muted-foreground transition-colors group-hover:text-signal">
                  0{i + 1}
                </span>
                <div>
                  <h2 className="text-xl">{s.title}</h2>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">{s.body}</p>
                </div>
                <span className="label-mono text-signal">{s.motion}</span>
                <ArrowRight className="h-4 w-4 -translate-x-2 text-signal opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
