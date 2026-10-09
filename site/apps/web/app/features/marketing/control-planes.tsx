import { useId, useState } from "react";

type Plane = {
  readonly id: string;
  readonly label: string;
  /** Shorter text for the drawn plate, where the full label does not fit. */
  readonly plateLabel?: string;
  readonly summary: string;
  readonly color: string;
};

/** From docs/architecture/README.md, "Where does governance fit in the IT landscape". */
const PLANES: readonly Plane[] = [
  {
    id: "governance",
    label: "Governance",
    summary:
      "What GovOps owns: the capability catalog, continuous evidence, continuous compliance, and governance metrics, all keyed on capability_id.",
    color: "#22c3d6",
  },
  {
    id: "access-management",
    label: "Access Management",
    plateLabel: "Access",
    summary:
      "Policy authoring, authorization, schema, federation, shared signals, IGA, and PAM. GovOps asks these systems to record every decision against a capability_id.",
    color: "#f97316",
  },
  {
    id: "observability",
    label: "Observability",
    summary:
      "SIEM, ITDR, analytics, threat detection, session recording, and kernel telemetry. GovOps asks these systems to link what ran back to the decision that allowed it.",
    color: "#22c55e",
  },
  {
    id: "identity",
    label: "Identity",
    summary:
      "Human, software, and organization identities. GovOps asks these systems for verifiable identifiers and attributes that enrich evidence about who or what acted.",
    color: "#3b82f6",
  },
];

const PLATE_HALF_WIDTH = 132;
const PLATE_HALF_HEIGHT = 66;
const PLATE_THICKNESS = 13;
const PLATE_GAP = 58;

/**
 * Drawn rather than shipped as the design's PNG: only the Governance tab state was ever exported,
 * so drawing it is what makes all four tabs work.
 */
export function ControlPlanes() {
  const [active, setActive] = useState(0);
  const gradientId = useId();

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <div role="tablist" aria-label="GovOps layers" className="flex flex-wrap gap-2">
          {PLANES.map((plane, index) => (
            <button
              key={plane.id}
              type="button"
              role="tab"
              id={`${gradientId}-tab-${plane.id}`}
              aria-selected={active === index}
              aria-controls={`${gradientId}-panel-${plane.id}`}
              onClick={() => setActive(index)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                active === index
                  ? "border-transparent bg-[var(--brand)] text-[var(--brand-ink)]"
                  : "border-[var(--edge)] text-[var(--ink-muted)] hover:border-[var(--edge-strong)] hover:text-[var(--ink)]"
              }`}
            >
              {plane.label}
            </button>
          ))}
        </div>

        <svg
          viewBox="0 0 340 400"
          className="mt-8 w-full max-w-md"
          role="img"
          aria-label={`Four stacked layers with ${PLANES[active]?.label} selected`}
        >
          <defs>
            {PLANES.map((plane) => (
              <linearGradient
                key={plane.id}
                id={`${gradientId}-${plane.id}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor={plane.color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={plane.color} stopOpacity="0.35" />
              </linearGradient>
            ))}
          </defs>

          {/* Drawn back to front so the lower plates sit behind the ones above them. */}
          {[...PLANES].reverse().map((plane) => {
            const index = PLANES.indexOf(plane);
            const isActive = index === active;
            const top = 96 + index * PLATE_GAP;
            return (
              <Plate
                key={plane.id}
                plane={plane}
                top={top}
                gradientId={`${gradientId}-${plane.id}`}
                active={isActive}
              />
            );
          })}
        </svg>
      </div>

      <div className="space-y-6">
        {PLANES.map((plane, index) => (
          <div
            key={plane.id}
            role="tabpanel"
            id={`${gradientId}-panel-${plane.id}`}
            aria-labelledby={`${gradientId}-tab-${plane.id}`}
            hidden={active !== index}
          >
            <h3 className="text-xl font-bold text-[var(--ink)]">{plane.label} layer</h3>
            <p className="mt-3 text-[var(--ink-muted)]">{plane.summary}</p>
          </div>
        ))}

        <ol className="space-y-5 border-t border-[var(--edge)] pt-6">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--edge-strong)] font-mono text-xs text-[var(--accent-to)]">
                {index + 1}
              </span>
              <div>
                <h4 className="font-semibold text-[var(--ink)]">{step.title}</h4>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const STEPS = [
  {
    title: "Define and classify",
    body: "Register every governed capability with a stable capability_id, an accountable owner, a risk tier, and a business impact.",
  },
  {
    title: "Authorize locally, govern centrally",
    body: "Policy Decision Points evaluate next to the resource. Policy, schema, and federation stay centrally versioned, reviewed, and audited.",
  },
  {
    title: "Observe, detect, respond",
    body: "Runtime evidence returns along the same capability_id, so a kernel-level event connects back to an owner, a policy, and a control.",
  },
] as const;

function Plate({
  plane,
  top,
  gradientId,
  active,
}: {
  readonly plane: Plane;
  readonly top: number;
  readonly gradientId: string;
  readonly active: boolean;
}) {
  const cx = 170;
  const w = PLATE_HALF_WIDTH;
  const h = PLATE_HALF_HEIGHT;
  const t = PLATE_THICKNESS;

  const face = `${cx},${top - h} ${cx + w},${top} ${cx},${top + h} ${cx - w},${top}`;
  const left = `${cx - w},${top} ${cx},${top + h} ${cx},${top + h + t} ${cx - w},${top + t}`;
  const right = `${cx + w},${top} ${cx},${top + h} ${cx},${top + h + t} ${cx + w},${top + t}`;

  return (
    <g opacity={active ? 1 : 0.34} style={{ transition: "opacity 260ms ease" }}>
      <polygon points={left} fill={plane.color} opacity="0.35" />
      <polygon points={right} fill={plane.color} opacity="0.2" />
      <polygon
        points={face}
        fill={`url(#${gradientId})`}
        stroke={plane.color}
        strokeOpacity={active ? 0.9 : 0.5}
        strokeWidth="1.5"
      />
      {/* Rotated into the plane of the plate. */}
      <text
        x={cx - 58}
        y={top + 6}
        transform={`rotate(26.5 ${cx - 58} ${top + 6})`}
        className="font-display"
        fontSize="17"
        fontWeight="600"
        fill={active ? "#ffffff" : plane.color}
        fillOpacity={active ? 1 : 0.9}
      >
        {plane.plateLabel ?? plane.label}
      </text>
    </g>
  );
}
