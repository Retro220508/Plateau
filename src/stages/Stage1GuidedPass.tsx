import { useMemo, useState } from "react";
import GridView from "../components/GridView";
import LatentHeatmap from "../components/LatentHeatmap";
import { LiveBadge } from "../components/Badges";
import PrevNext from "../components/PrevNext";
import { DEMO_PUZZLE } from "../lib/grid";
import { runLatentRefinement, TRAINING_CAP } from "../lib/latentModel";

function narrationFor(step: number): string {
  if (step <= 2) return "Step 1–2 — mostly noise. The latent state still looks close to the raw input encoding.";
  if (step <= 5) return "Step 3–5 — a rough shape emerges. Some cells are already stable; most are still flickering.";
  if (step <= 8) return "Step 6–8 — the transformation is mostly resolved. Confidence per cell is rising.";
  if (step <= TRAINING_CAP) return "Step 9–11 — locked in. This is the range the model was tuned to converge within.";
  return "Beyond step 11, you're past what this walkthrough trained for — that's Stage 3's territory.";
}

export default function Stage1GuidedPass({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const trajectory = useMemo(() => runLatentRefinement(DEMO_PUZZLE, 12), []);
  const [step, setStep] = useState(1);
  const at = trajectory[step - 1];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <LiveBadge />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Scrub through one fixed puzzle yourself</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Same puzzle as the cold open. Drag the slider — every position triggers a fresh forward pass of the toy
        model, from scratch, at that many refinement steps.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <input
          type="range"
          min={1}
          max={12}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <span key={n} className={n === step ? "font-bold text-indigo-600" : ""}>
              {n}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">
          <span className="font-semibold">Step {step}:</span> {narrationFor(step)}
        </div>

        <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
          <GridView grid={DEMO_PUZZLE.input} title="input" cellSize={24} />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-6">
              <GridView grid={at.candidate} compareGrid={DEMO_PUZZLE.output} title={`guess @ step ${step}`} cellSize={24} />
              <GridView grid={DEMO_PUZZLE.output} dim title="ground truth" cellSize={24} />
            </div>
            <div className="text-sm font-medium text-slate-600">
              accuracy vs. truth: <span className="text-indigo-600">{Math.round(at.accuracy * 100)}%</span>
              <span className="ml-2 text-xs text-slate-400">
                (error: {Math.round((1 - at.accuracy) * 100)}%)
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <LatentHeatmap z={at.z} cellSize={15} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        This puzzle is one the walkthrough is built around — good for building intuition, but it's not a fair test
        of the claim. Stage 3 gives you a puzzle the model has never been "shown" in this app before.
      </p>

      <PrevNext onPrev={onPrev} onNext={onNext} />
    </section>
  );
}
