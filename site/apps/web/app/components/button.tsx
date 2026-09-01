import type { ReactNode } from "react";
import { Link } from "react-router";

type Variant = "primary" | "secondary";

const STYLES: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-[var(--brand-ink)] border border-transparent hover:bg-[var(--brand-hover)] shadow-[0_10px_30px_-12px_var(--glow)]",
  secondary:
    "border border-[var(--edge-strong)] text-[var(--ink)] hover:border-[var(--accent-to)] hover:text-[var(--ink)]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition duration-200";

type ButtonLinkProps = {
  readonly to: string;
  readonly variant?: Variant;
  readonly children: ReactNode;
  readonly className?: string;
};

export function ButtonLink({ to, variant = "primary", children, className = "" }: ButtonLinkProps) {
  const classes = `${BASE} ${STYLES[variant]} ${className}`;
  const external = /^https?:\/\//.test(to);

  if (external) {
    return (
      <a href={to} className={classes} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}
