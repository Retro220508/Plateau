import type { ReactNode } from "react";

function Base({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

export function LiveBadge() {
  return (
    <Base className="bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      Live client-side inference
    </Base>
  );
}

export function PrecomputedBadge({ label = "Precomputed / published data" }: { label?: string }) {
  return (
    <Base className="bg-amber-100 text-amber-700 ring-1 ring-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {label}
    </Base>
  );
}

export function SyntheticBadge() {
  return (
    <Base className="bg-sky-100 text-sky-700 ring-1 ring-sky-300">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
      Synthetic ground truth
    </Base>
  );
}

export function NeedsVerificationBadge() {
  return (
    <Base className="bg-rose-100 text-rose-700 ring-1 ring-rose-300">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
      Needs verification
    </Base>
  );
}

export function DeveloperReportedBadge() {
  return (
    <Base className="bg-violet-100 text-violet-700 ring-1 ring-violet-300">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
      Developer-reported
    </Base>
  );
}
