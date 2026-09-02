# Handoff to a second Lovable account

## First: move the project, don't retype it

The code does not travel with a prompt. Do one of these before pasting anything:

- **GitHub (recommended):** connect this project to GitHub, then in the second account create a project from that repo.
- **Remix:** make this project public/remixable and remix it from the second account.

If the second account starts from an empty project, the prompt below will rebuild from scratch instead of continuing, and the work already done here is lost.

## Then: paste this exact prompt in the second account

```text
Continue an in-progress rebuild of the Prime Automation website (https://www.primeautomationpl.com/)
as a premium, cinematic, multi-page 3D site. Do not restart or redesign — build on what exists.

STACK (already installed): TanStack Start + React 19 + TypeScript, Tailwind v4 (src/styles.css),
three, @react-three/fiber v9, @react-three/drei v10, motion.

ALREADY BUILT — do not rewrite these:
- src/styles.css — dark design system. Canvas #07090f, signal #4fd8e8, compute #8b5cf6, alert #e8c84a.
  Tokens: --signal --compute --alert --grid --surface --surface-2 --glow-signal --glow-compute
  --gradient-signal --gradient-surface. Fonts: Space Grotesk (display), IBM Plex Sans, IBM Plex Mono.
  Utilities: text-gradient, panel, grid-floor, label-mono, magnetic.
  Keyframes: dash-flow, pulse-node, scan, rise (animate-flow / animate-node / animate-rise).
  prefers-reduced-motion disables all animation.
- src/components/three/HeroScene.tsx — lazy R3F scene: AI core, instanced node rings that activate
  near the cursor, connection lines, data packets, dust, moving grid floor, camera rig driven by
  cursor parallax + scroll depth. Mobile simplifies to 1 ring / 200 dust.
- src/components/site/CustomCursor.tsx — desktop-only cursor, labels from data-cursor
  (VIEW / OPEN / RUN / CONNECT / TRACE / EXPLORE).
- src/components/site/Nav.tsx — Nav (services dropdown, mobile drawer, "Book a Free Audit") + Footer.
- src/components/site/LiveDashboard.tsx — OS-style panel: status cycle OFFLINE→CONNECTING→PROCESSING→
  ACTIVE, sparkline, radial gauges, bars, activity feed, Run/Pause/Reset. Data labelled illustrative.
- src/components/site/visuals.tsx — per-page motion systems: ArchitectureAssembly, AgentNetwork,
  WorkflowEngine, DataStreamVisual, ModelPipeline, IntegrationOrbit, AuditRadar, TechEcosystem,
  ProcessTimeline.
- src/components/site/primitives.tsx — Reveal, AnimatedMetric, MagneticLink, SectionLabel, PageHeader.
- src/components/site/PrimeAI.tsx — collapsed "● PRIME AI" panel with 5 prompts.
- src/components/site/ServicePage.tsx — shared service page layout.
- src/lib/site-data.ts — services (ai-agents, workflow-automation, data-engineering, custom-ai,
  integration, ai-audit), caseStudies (stylecart, cloudmetrics, medicare-plus), processSteps, stats.
- src/routes/index.tsx (home) and src/routes/services/index.tsx.

REMAINING WORK — the build currently fails typecheck because these route files do not exist:
1. src/routes/services/ai-agents.tsx, workflow-automation.tsx, data-engineering.tsx, custom-ai.tsx,
   integration.tsx, ai-audit.tsx — use ServicePage.tsx, each with its matching visuals.tsx component.
2. src/routes/case-studies/index.tsx and src/routes/case-studies/$slug.tsx — driven by caseStudies,
   using AnimatedMetric and Reveal.
3. src/routes/process.tsx, technology.tsx, about.tsx, contact.tsx.
4. src/routes/__root.tsx — mount Nav, Footer, CustomCursor, PrimeAI and page transitions; load
   Space Grotesk + IBM Plex via a <link> in the root head (never @import a URL in styles.css).
5. Per-route head() metadata: unique title, description, og:title, og:description on every page.
6. Verify in the browser: 3D hero renders, cursor states work, mobile simplifies, no console errors,
   clean typecheck and build.

RULES:
- Keep existing brand: logo, colors, images, copy, case-study assets. Never invent clients,
  testimonials, statistics, partnerships, certifications, or company claims.
- Every page gets its own motion identity — never the same fade-up everywhere.
- Dashboard numbers are illustrative and must stay labelled as such.
- Desktop: full 3D + cursor + particles. Mobile: fewer particles, lighter 3D, vertical workflows.
- Respect prefers-reduced-motion; lazy-load the 3D scene.
- Do not make everything a card — use open layouts, diagrams, dashboards, typography, full-screen scenes.
- No generic AI look: no glassmorphism-everything, no rainbow gradients, no robot imagery.

Start with item 1 and work through to item 6.
```

## Note on credits

Only the remaining route files and the root layout are left, so the continuation should be
a fraction of the work already done here.
