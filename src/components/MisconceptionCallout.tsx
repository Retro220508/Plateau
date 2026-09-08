export default function MisconceptionCallout({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50 ${compact ? "p-3" : "p-4"} text-amber-900`}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-lg">⚠️</span>
        <div>
          <div className="text-sm font-semibold">Common misconception</div>
          <p className={`mt-1 text-amber-800 ${compact ? "text-xs" : "text-sm"}`}>
            "More latent refinement steps always means more reasoning." It doesn't — this model has a{" "}
            <strong>fixed-size state</strong> (a capacity ceiling), so extra steps past that ceiling stop adding
            information and can actively destabilize an already-correct answer. Compute ≠ capability once the
            container is full.
          </p>
        </div>
      </div>
    </div>
  );
}
