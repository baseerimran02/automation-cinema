export const services = [
  {
    slug: "ai-agents",
    to: "/services/ai-agents",
    title: "AI Chatbots & Virtual Agents",
    short: "AI Agents",
    motion: "AGENT NETWORK",
    body: "Custom-trained conversational AI that handles customer queries, books appointments, and qualifies leads 24/7.",
  },
  {
    slug: "workflow-automation",
    to: "/services/workflow-automation",
    title: "Workflow Automation",
    short: "Workflow Automation",
    motion: "WORKFLOW ENGINE",
    body: "Connect your tools, eliminate manual tasks, and build trigger-action pipelines that run on autopilot.",
  },
  {
    slug: "data-engineering",
    to: "/services/data-engineering",
    title: "Data Pipeline Engineering",
    short: "Data Engineering",
    motion: "DATA STREAM",
    body: "ETL pipelines, real-time data processing, and warehouse architecture that turns raw data into actionable intelligence.",
  },
  {
    slug: "custom-ai",
    to: "/services/custom-ai",
    title: "Custom AI Model Development",
    short: "Custom AI",
    motion: "MODEL PIPELINE",
    body: "Fine-tuned LLMs, computer vision systems, and predictive models built for your specific domain and data.",
  },
  {
    slug: "integration",
    to: "/services/integration",
    title: "AI System Integration",
    short: "Integration",
    motion: "CONNECTED ECOSYSTEM",
    body: "Seamlessly embed AI into your existing tech stack — CRM, ERP, helpdesk, e-commerce, and more.",
  },
  {
    slug: "ai-audit",
    to: "/services/ai-audit",
    title: "AI Audit & Optimization",
    short: "AI Audit",
    motion: "SYSTEM SCAN",
    body: "Comprehensive assessment of your current automation maturity with a roadmap to maximize ROI.",
  },
] as const;

export const caseStudies = [
  {
    slug: "stylecart",
    sector: "E-Commerce",
    headline: "+340% ROI",
    title: "AI-Powered Customer Support for StyleCart",
    body: "Custom chatbot handling 80% of customer queries without human intervention, transforming support operations.",
    metrics: [
      { label: "Ticket reduction", value: 65, suffix: "%" },
      { label: "Annual savings", value: 180, suffix: "K", prefix: "$" },
    ],
    stack: ["LLM agent", "Helpdesk API", "Knowledge base", "Escalation routing"],
  },
  {
    slug: "cloudmetrics",
    sector: "SaaS / Fintech",
    headline: "90% Faster",
    title: "Automated Onboarding Pipeline for CloudMetrics",
    body: "End-to-end document processing and onboarding automation that cut time-to-activate from 3 weeks to 2 days.",
    metrics: [
      { label: "Conversion rate", value: 3, suffix: "x" },
      { label: "Onboarding time", value: 2, suffix: " days" },
    ],
    stack: ["Document AI", "Workflow engine", "CRM sync", "Notifications"],
  },
  {
    slug: "medicare-plus",
    sector: "Healthcare",
    headline: "40% Fewer No-Shows",
    title: "Patient Scheduling Automation for MediCare Plus",
    body: "Automated appointment reminders and follow-ups that saved 25 hours of staff time per week.",
    metrics: [
      { label: "Hours saved weekly", value: 25, suffix: "hrs" },
      { label: "Patient satisfaction", value: 15, suffix: "%", prefix: "+" },
    ],
    stack: ["Scheduling API", "SMS/email agent", "EHR integration", "Analytics"],
  },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Discovery & Audit",
    body: "Deep-dive into your operations, pain points, and automation opportunities.",
  },
  {
    n: "02",
    title: "Architecture & Design",
    body: "Blueprint your AI systems, select the right tech stack, and map integrations.",
  },
  {
    n: "03",
    title: "Build & Test",
    body: "Agile development with weekly demos, rigorous testing, and iterative refinement.",
  },
  {
    n: "04",
    title: "Deploy & Optimize",
    body: "Launch, monitor, and continuously improve based on real performance data.",
  },
];

export const stats = [
  { value: 150, suffix: "+", label: "Projects delivered" },
  { value: 40, suffix: "%", label: "Avg. cost reduction" },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 24, suffix: "/7", label: "Automated workflows" },
];
