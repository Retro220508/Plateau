import MisconceptionCallout from "../components/MisconceptionCallout";
import { PRIMARY_SOURCES } from "../lib/bdhcqData";

const OBJECTIVES = [
  "State the one-sentence claim in your own words.",
  "Predict, before running it, whether more compute steps will help, hurt, or plateau on a given puzzle.",
  "Locate where this mechanism appears in BDH-CQ, and how it differs from BDH's mechanism.",
  "Name one limitation (capacity ceiling / no verbal interpretability of intermediate steps).",
];

export default function Stage7Limitations({ onPrev, onRestart }: { onPrev: () => void; onRestart: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Wrap-up</div>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Limitations, plainly stated</h1>

      <div className="mt-5 space-y-3">
        <MisconceptionCallout />
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-800">Limitation 1 — capacity ceiling</div>
          <p className="mt-1 text-sm text-slate-600">
            A fixed-size recurrent state can only hold so much refined information. Push computation past what it
            was tuned for and the extra steps have nowhere useful to go — you saw this directly in Stage 3.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-800">Limitation 2 — no verbal interpretability</div>
          <p className="mt-1 text-sm text-slate-600">
            Because intermediate steps are never decoded to language, you can't ask this class of model "what are
            you thinking right now" the way you can with chain-of-thought. The latent heatmap is a compressed,
            illustrative proxy — it is not a transcript of reasoning.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-800">Limitation 3 — this toy model is not BDH-CQ</div>
          <p className="mt-1 text-sm text-slate-600">
            It's an independent toy system, hand-specified to exhibit the same class of behavior for teaching
            purposes — not a trained neural network, not an official BDH or BDH-CQ implementation, and not a
            reproduction of BDH-CQ's reported numbers. See the "How this actually works" panel and the README for
            the full disclosure.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="text-sm font-semibold text-slate-800">Your mission — check yourself</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {OBJECTIVES.map((o, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <div className="text-sm font-semibold text-slate-800">Keep going — primary sources</div>
        <ul className="mt-3 space-y-2">
          {PRIMARY_SOURCES.map((s) => (
            <li key={s.id} className="rounded-lg border border-slate-100 bg-white p-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">
                {s.title} <span className="font-normal text-slate-400">— {s.authors} ({s.id})</span>
              </div>
              <div className="mt-1 text-slate-500">{s.relevance}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-5">
        <button onClick={onPrev} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          ← Back
        </button>
        <button
          onClick={onRestart}
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Restart from the cold open ↺
        </button>
      </div>
    </section>
  );
}
