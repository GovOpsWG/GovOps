import {
  Activity,
  Bot,
  Boxes,
  Briefcase,
  Eye,
  Gauge,
  Layers,
  Link2,
  Repeat,
  ScrollText,
  ShieldCheck,
  Sparkles,
  UserCog,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

import { ButtonLink } from "~/components/button";
import { ControlPlanes } from "~/features/marketing/control-planes";
import { ECOSYSTEM, GITHUB_URL } from "~/lib/site";

export function Hero({ version }: { readonly version: string | null }) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--edge)]">
      <div className="circuit-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* The design's hero glow, as a gradient rather than the 280 KB background JPEG. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 130% at 50% 118%, var(--glow-core), var(--glow) 42%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <Link
          to="/releases"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--edge)] px-3.5 py-1.5 text-xs text-[var(--ink-muted)] transition hover:border-[var(--accent-to)]"
        >
          <Sparkles className="size-3.5 text-[var(--accent-to)]" aria-hidden="true" />
          {version ? `Latest release ${version}` : "Working group drafts in progress"}
        </Link>

        <h1 className="mt-8 text-4xl leading-[1.1] font-bold sm:text-6xl">
          <span className="accent-text">Measure risk, transparency,</span>
          <br />
          <span className="accent-text">and accountability</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--ink-muted)]">
          GovOps is an open, vendor-neutral architecture for authorization governance. Govern
          capabilities centrally, authorize locally next to the resource, and join the two with a
          stable <code className="font-mono text-[var(--accent-to)]">capability_id</code> that
          travels from the catalog to the kernel.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/docs/architecture">Read the architecture</ButtonLink>
          <ButtonLink to={GITHUB_URL} variant="secondary">
            View on GitHub
          </ButtonLink>
        </div>

        <p className="mt-10 font-mono text-xs tracking-wide text-[var(--ink-faint)]">
          Govern &rarr; Authorize &rarr; Execute &rarr; Observe &rarr; Detect &rarr; Respond
        </p>
      </div>
    </section>
  );
}

const WHY = [
  {
    icon: ShieldCheck,
    title: "Manage risk proactively",
    body: "A finite, enumerable catalog of capabilities carries risk tier and business impact, so remediation queues can be ranked by likely failure against real consequence rather than treated as an undifferentiated checklist.",
  },
  {
    icon: Eye,
    title: "Gain full transparency",
    body: "Authorization decisions, application telemetry, and kernel observability all carry the same capability_id. Runtime activity can be read in business terms, not only technical ones.",
  },
  {
    icon: UserCog,
    title: "Drive accountability",
    body: "Every capability has an accountable owner and the policy versions that governed it. When something goes wrong, there is a name to call and a record of what the rules were at the time.",
  },
] as const;

export function WhyGovOps() {
  return (
    <Section
      eyebrow="Why GovOps"
      title="Risk measures posture. Transparency reveals process. Accountability validates execution."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {WHY.map((item) => (
          <FeatureCard key={item.title} icon={item.icon} title={item.title}>
            {item.body}
          </FeatureCard>
        ))}
      </div>
    </Section>
  );
}

const ACTORS = [
  { icon: Briefcase, label: "Workloads" },
  { icon: Bot, label: "AI agents" },
  { icon: UserCog, label: "Service accounts" },
  { icon: Link2, label: "Pipelines" },
  { icon: Boxes, label: "Microservices" },
] as const;

export function NewEra() {
  return (
    <Section
      eyebrow="A new era of governance"
      title="Authority no longer flows through people"
      deep
    >
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-5 text-[var(--ink-muted)]">
          <p>
            Traditional governance was built for a world where humans were the primary actors. Today
            authority flows through workloads, agents, service accounts, pipelines, and distributed
            microservices, executing high-impact actions at machine speed.
          </p>
          <p>
            Manual reviews and periodic audits cannot keep pace. GovOps replaces them with
            declarative policy, explicit trust definitions, governed schemas, and continuous
            compliance checks that produce evidence as a by-product of running the system.
          </p>
          <p className="text-[var(--ink)]">
            Governance artifacts stay centralized. Authorization decisions stay local, close to the
            application, database, device, or agent they protect.
          </p>
          <Link
            to="/docs/architecture#what-is-governance"
            className="inline-block text-[var(--accent-from)] hover:underline"
          >
            What does it mean to govern?
          </Link>
        </div>

        <ul className="flex flex-wrap gap-3">
          {ACTORS.map((actor) => (
            <li key={actor.label} className="surface-card flex items-center gap-3 px-4 py-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[var(--brand)] text-[var(--brand-ink)]">
                <actor.icon className="size-4.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-[var(--ink)]">{actor.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function ControlPlanesSection() {
  return (
    <Section
      eyebrow="GovOps control planes"
      title="Four layers, one join key"
      lead="Effective authorization governance depends on governance, identity, visibility, and event handling. Each answers a different question, and capability_id is what connects the answers."
    >
      <ControlPlanes />
    </Section>
  );
}

const OUTCOMES = [
  {
    icon: Repeat,
    title: "Continuous",
    body: "Always-on assurance instead of periodic review.",
  },
  {
    icon: ScrollText,
    title: "Provable",
    body: "Evidence produced by the running system, not assembled at audit time.",
  },
  {
    icon: Workflow,
    title: "Operational",
    body: "Integrated into daily workflows and real-time systems.",
  },
  {
    icon: Gauge,
    title: "Aligned",
    body: "Matched to the velocity and complexity of modern infrastructure.",
  },
] as const;

export function Outcome() {
  return (
    <Section eyebrow="The outcome" title="Governance that is" deep>
      <div className="grid gap-5 sm:grid-cols-2">
        {OUTCOMES.map((item) => (
          <FeatureCard key={item.title} icon={item.icon} title={item.title}>
            {item.body}
          </FeatureCard>
        ))}
      </div>

      <blockquote className="mt-14 text-center text-2xl leading-snug font-semibold text-balance sm:text-3xl">
        <span className="accent-text">
          GovOps brings the speed, automation, and rigor of modern Ops disciplines into governance,
          so organizations can defend themselves in the operational plane where threats actually
          occur.
        </span>
      </blockquote>
    </Section>
  );
}

const SERVICES = [
  {
    icon: Layers,
    title: "Capability catalog",
    body: "A machine-readable inventory of what applications, APIs, workloads, and agents can actually do — with owner, risk tier, and business impact attached.",
    to: "/docs/acc",
  },
  {
    icon: ScrollText,
    title: "Policy and schema management",
    body: "Centralized administration of the rules and of the entities, attributes, and claims those rules reference. Enforcement stays distributed.",
    to: "/docs/architecture#centralized-policy-management",
  },
  {
    icon: ShieldCheck,
    title: "Federation management",
    body: "Which issuers, credentials, algorithms, and claims the enterprise is willing to trust — an explicit governance decision, not an implicit one.",
    to: "/docs/architecture#federation-management",
  },
  {
    icon: Activity,
    title: "Continuous compliance",
    body: "Capabilities map once to a canonical control layer, then project through OSCAL and Trestle into NIST, ISO 27001, SOC 2, or an internal framework.",
    to: "/docs/architecture#continuous-compliance",
  },
] as const;

export function HowItWorks() {
  return (
    <Section
      eyebrow="How does it work?"
      title="Shared services between business governance and distributed enforcement"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {SERVICES.map((service) => (
          <Link
            key={service.title}
            to={service.to}
            className="surface-card group p-6 transition hover:border-[var(--edge-strong)] sm:p-7"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--edge)] text-[var(--accent-to)]">
              <service.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-[var(--ink)]">
              {service.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">{service.body}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

const DELIVERABLES = [
  {
    title: "Authorization Capability Catalog",
    status: "Draft for discussion",
    body: "The catalog model, the Authorization Capability Profile over Gemara, and the export path to OSCAL and Trestle — with four worked persona use cases.",
    to: "/docs/acc",
  },
  {
    title: "Governance metrics",
    status: "Draft for sub-group comment",
    body: "What counts as a GovOps metric, the admissions rule that a metric must report a change rather than a level, and the first published entry.",
    to: "/docs/metrics",
  },
  {
    title: "Architecture",
    status: "Draft",
    body: "The GovOps loop, the Governance and Runtime planes, the nine GovOps services, and the runtime authorization context that joins a decision to what executed.",
    to: "/docs/architecture",
  },
] as const;

export function Deliverables() {
  return (
    <Section
      eyebrow="Working group deliverables"
      title="Everything is public, in the open, and editable"
      lead="GovOps is developed as an OWASP working group proposal. Every document below lives in the repository as Markdown; the site renders it directly."
      deep
    >
      <div className="grid gap-5 md:grid-cols-3">
        {DELIVERABLES.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="surface-card flex flex-col p-6 transition hover:border-[var(--edge-strong)]"
          >
            <span className="self-start rounded-full border border-[var(--edge)] px-2.5 py-1 text-xs text-[var(--ink-faint)]">
              {item.status}
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-[var(--ink)]">
              {item.title}
            </h3>
            <p className="mt-2 flex-1 text-sm text-[var(--ink-muted)]">{item.body}</p>
            <span className="mt-4 text-sm text-[var(--accent-from)]">Read it &rarr;</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[var(--edge)] pt-8">
        <span className="text-xs tracking-wide text-[var(--ink-faint)] uppercase">
          Contributed to by
        </span>
        {ECOSYSTEM.map((project) => (
          <a
            key={project.href}
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
          >
            {project.name}
          </a>
        ))}
      </div>
    </Section>
  );
}

export function CallToAction() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--edge)] band-deep">
      <div className="circuit-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Start governing at <span className="accent-text">machine speed</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[var(--ink-muted)]">
          Your infrastructure already operates in real time. Your governance should too. Read the
          architecture, then bring a capability from your own estate to the working group.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/docs">Read the documentation</ButtonLink>
          <ButtonLink to="/docs/outreach" variant="secondary">
            Join the working group
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Section({
  eyebrow,
  title,
  lead,
  deep = false,
  children,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
  readonly deep?: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <section
      className={`border-b border-[var(--edge)] ${deep ? "band-deep" : ""}`}
      aria-labelledby={slug(eyebrow)}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-wide text-[var(--accent-to)] uppercase">
            {eyebrow}
          </p>
          <h2 id={slug(eyebrow)} className="mt-4 text-3xl font-bold text-balance sm:text-4xl">
            {title}
          </h2>
          {lead ? <p className="mt-5 text-[var(--ink-muted)]">{lead}</p> : null}
        </header>

        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  children,
}: {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-6 sm:p-7">
      <span className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--edge)] text-[var(--accent-to)]">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">{children}</p>
    </div>
  );
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
