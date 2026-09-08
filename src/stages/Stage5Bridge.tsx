import PrevNext from "../components/PrevNext";
import { PrecomputedBadge } from "../components/Badges";

export default function Stage5Bridge({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Bridge to a real system</div>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        You just changed the compute budget in latent space.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        The toy model you just pushed past its limit is deliberately tiny — small enough to run instantly in your
        browser, small enough for its entire mechanism to fit in one page. But the mechanism you just exercised with
        a slider — <em>iterating a fixed-size recurrent latent state instead of writing out reasoning as tokens</em>
        — is exactly what a real, published research system does at production scale.
      </p>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        That system is called <strong>BDH-CQ</strong>. It solves ARC-AGI-style puzzles by updating a recurrent
        memory from demonstrations, then reasoning over a query entirely inside a continuous latent workspace —
        never verbalizing an intermediate step. Next, you'll see its published effort-vs-accuracy results, plotted
        the same way as your sandbox chart, so the two are directly comparable.
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <PrecomputedBadge label="What's coming next is NOT live" />
        <span className="text-xs text-amber-800">
          BDH-CQ is a 150M-parameter research system — it cannot run in a browser tab. Its numbers are published,
          not reproduced by this team, and are labeled that way throughout.
        </span>
      </div>

      <PrevNext onPrev={onPrev} onNext={onNext} nextLabel="Open the BDH-CQ dashboard" />
    </section>
  );
}
