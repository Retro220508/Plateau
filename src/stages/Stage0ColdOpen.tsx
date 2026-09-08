import { useMemo } from "react";
import GridView from "../components/GridView";
import LatentHeatmap from "../components/LatentHeatmap";
import AccuracyChart from "../components/AccuracyChart";
import { LiveBadge, SyntheticBadge } from "../components/Badges";
import PrevNext from "../components/PrevNext";
import { DEMO_PUZZLE } from "../lib/grid";
import { runLatentRefinement } from "../lib/latentModel";

const COLD_OPEN_STEP = 6;

export default function Stage0ColdOpen({ onNext }: { onNext: () => void }) {
  const trajectory = useMemo(() => runLatentRefinement(DEMO_PUZZLE, 12), []);
  const at = trajectory[COLD_OPEN_STEP - 1];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <LiveBadge />
        <SyntheticBadge />
        <span className="text-xs text-slate-400">nothing below is a screenshot — it's a real run, already in progress</span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        A model is mid-thought. Just watch for a moment.
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        This is step {COLD_OPEN_STEP} of a 12-step refinement run on a 5×5 puzzle. The model has never verbalized a
        single word of reasoning — everything happening below is a vector being nudged, over and over, inside a
        fixed-size latent state.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <div className="flex flex-col items-center gap-3 sm:col-span-1">
          <div className="flex items-end gap-4">
            <GridView grid={DEMO_PUZZLE.input} title="input" cellSize={22} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 sm:col-span-1">
          <div className="flex items-end gap-6">
            <GridView grid={at.candidate} compareGrid={DEMO_PUZZLE.output} title={`guess @ step ${COLD_OPEN_STEP}`} cellSize={22} />
            <GridView grid={DEMO_PUZZLE.output} dim title="ground truth" subtitle="shown faintly, for reference" cellSize={22} />
          </div>
          <div className="text-sm font-medium text-slate-600">
            current accuracy: <span className="text-indigo-600">{Math.round(at.accuracy * 100)}%</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 sm:col-span-1">
          <LatentHeatmap z={at.z} cellSize={14} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          error, already ticking down before you touched anything
        </div>
        <AccuracyChart data={trajectory.slice(0, COLD_OPEN_STEP).map((t) => ({ step: t.step, accuracy: t.accuracy }))} currentStep={COLD_OPEN_STEP} height={200} />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        You'll get the controls in a moment. First: this run, this puzzle, and this exact accuracy curve are all
        computed live by a small recurrent model running in your browser right now — not a recording.
      </p>

      <PrevNext onNext={onNext} nextLabel="Take the controls" />
    </section>
  );
}
