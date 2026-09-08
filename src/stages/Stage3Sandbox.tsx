import { useMemo, useState } from "react";
import GridView from "../components/GridView";
import LatentHeatmap from "../components/LatentHeatmap";
import AccuracyChart from "../components/AccuracyChart";
import { LiveBadge, SyntheticBadge } from "../components/Badges";
import MisconceptionCallout from "../components/MisconceptionCallout";
import PrevNext from "../components/PrevNext";
import { HELD_OUT_PUZZLES } from "../lib/grid";
import { runLatentRefinement, MAX_STEPS, TRAINING_CAP } from "../lib/latentModel";

const REGIME_STYLE: Record<string, string> = {
  converging: "bg-emerald-100 text-emerald-700 ring-emerald-300",
  plateau: "bg-amber-100 text-amber-700 ring-amber-300",
  degrading: "bg-rose-100 text-rose-700 ring-rose-300",
};

const REGIME_LABEL: Record<string, string> = {
  converging: "converging",
  plateau: "plateau — right at the ceiling",
  degrading: "degrading — past the ceiling",
};

interface Props {
  puzzleIndex: number;
  setPuzzleIndex: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Stage3Sandbox({ puzzleIndex, setPuzzleIndex, onNext, onPrev }: Props) {
  const puzzle = HELD_OUT_PUZZLES[puzzleIndex];
  const trajectory = useMemo(() => runLatentRefinement(puzzle, MAX_STEPS), [puzzle]);
  const [step, setStep] = useState(1);
  const at = trajectory[step - 1];
  const peakAccuracy = Math.max(...trajectory.map((t) => t.accuracy));
  const peakStep = trajectory.find((t) => t.accuracy === peakAccuracy)?.step ?? 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <LiveBadge />
        <SyntheticBadge />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          held-out — never used in Stages 0–1
        </span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sandbox: try to break the claim</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Full range this time: 1–{MAX_STEPS} steps, on a puzzle the walkthrough never showed you. Push it past the
        model's trained capacity (step {TRAINING_CAP}) and watch what actually happens to accuracy.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {HELD_OUT_PUZZLES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              setPuzzleIndex(i);
              setStep(1);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              i === puzzleIndex
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-slate-300 text-slate-500 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            held-out puzzle {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <input
            type="range"
            min={1}
            max={MAX_STEPS}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <span className="ml-4 w-24 shrink-0 text-right text-sm font-semibold text-slate-700">step {step}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${REGIME_STYLE[at.regime]}`}>
            {REGIME_LABEL[at.regime]}
          </span>
          <span className="text-xs text-slate-400">
            trained cap = {TRAINING_CAP} steps · peak accuracy {Math.round(peakAccuracy * 100)}% at step {peakStep}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
          <GridView grid={puzzle.input} title="unseen input" cellSize={24} />
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-6">
              <GridView grid={at.candidate} compareGrid={puzzle.output} title={`guess @ step ${step}`} cellSize={24} />
              <GridView grid={puzzle.output} dim title="ground truth" cellSize={24} />
            </div>
            <div className="text-sm font-medium text-slate-600">
              accuracy: <span className="text-indigo-600">{Math.round(at.accuracy * 100)}%</span>
            </div>
          </div>
          <div className="flex justify-center">
            <LatentHeatmap z={at.z} cellSize={15} />
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            live accuracy vs. steps, this puzzle
          </div>
          <AccuracyChart data={trajectory.map((t) => ({ step: t.step, accuracy: t.accuracy }))} currentStep={step} />
        </div>
      </div>

      <div className="mt-6">
        <MisconceptionCallout />
      </div>

      <PrevNext onPrev={onPrev} onNext={onNext} nextLabel="Explain what you saw" />
    </section>
  );
}
