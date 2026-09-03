import { Link } from "react-router";

type LogoProps = {
  readonly className?: string;
  readonly compact?: boolean;
};

/**
 * Both variants are rendered and CSS picks one: the artwork is a PNG, and `picture` cannot switch
 * on `data-theme`. Collapses to a single inline SVG once a vector lockup exists.
 */
export function Logo({ className = "", compact = false }: LogoProps) {
  if (compact) {
    return (
      <img
        src="/brand/govops-mark.png"
        alt="GovOps"
        width={32}
        height={30}
        className={`h-8 w-auto ${className}`}
      />
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/brand/govops-lockup-light.png"
        alt="GovOps"
        width={720}
        height={229}
        className="h-8 w-auto dark-only"
      />
      <img
        src="/brand/govops-lockup-dark.png"
        alt=""
        aria-hidden="true"
        width={720}
        height={229}
        className="h-8 w-auto light-only"
      />
    </span>
  );
}

export function LogoLink() {
  return (
    <Link to="/" className="shrink-0 rounded-md" aria-label="GovOps home">
      <Logo />
    </Link>
  );
}
