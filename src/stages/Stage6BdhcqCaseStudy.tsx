import { useMemo, useState } from "react";
import AccuracyChart from "../components/AccuracyChart";
import BdhcqEffortChart from "../components/BdhcqEffortChart";
import { DeveloperReportedBadge, LiveBadge, NeedsVerificationBadge, PrecomputedBadge } from "../components/Badges";
import PrevNext from "../components/PrevNext";
import { HELD_OUT_PUZZLES } from "../lib/grid";
import { runLatentRefinement, MAX_STEPS } from "../lib/latentModel";
import { BDHCQ_EFFORT_CURVE, BDHCQ_KEY_CLAIMS, BDHCQ_SOURCE, BDH_VS_BDHCQ } from "../lib/bdhcqData";

type View = "toy" | "bdhcq" | "both";

export default function Stage6BdhcqCaseStudy({
  puzzleIndex,
  onNext,
  onPrev,
}: {
  puzzleIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [view, setView] = useState<View>("both");
  const puzzle = HELD_OUT_PUZZLES[puzzleIndex];
  const trajectory = useMemo(() => runLatentRefinement(puzzle, MAX_STEPS), [puzzle]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">BDH-CQ: the same pattern, at scale</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Source: <em>{BDHCQ_SOURCE.title}</em> ({BDHCQ_SOURCE.authors.split(",")[0]} et al.), {BDHCQ_SOURCE.arxiv}.{" "}
        <a href={BDHCQ_SOURCE.url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
          {BDHCQ_SOURCE.url}
        </a>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["toy", "Our toy model"],
            ["bdhcq", "BDH-CQ (published)"],
            ["both", "Compare side-by-side"],
          ] as [View, string][]
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              view === v ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-300 text-slate-600 hover:border-indigo-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={`mt-6 grid grid-cols-1 gap-6 ${view === "both" ? "lg:grid-cols-2" : ""}`}>
        {(view === "toy" || view === "both") && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">Our toy model — accuracy vs. steps</div>
              <LiveBadge />
            </div>
            <AccuracyChart data={trajectory.map((t) => ({ step: t.step, accuracy: t.accuracy }))} />
            <p className="mt-2 text-xs text-slate-400">
              Independent toy model, not an official BDH or BDH-CQ system. Re-run live from Stage 3's held-out
              puzzle {puzzleIndex + 1}.
            </p>
          </div>
        )}
        {(view === "bdhcq" || view === "both") && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">BDH-CQ — pass@2 vs. reasoning effort</div>
              <PrecomputedBadge />
            </div>
            <BdhcqEffortChart />
            <p className="mt-2 text-xs text-slate-400">
              Published results on ARC-AGI-1, not reproduced by this team. LOW/MEDIUM bars are illustrative
              placeholders (see badges below) — only the HIGH-effort point is a confirmed published figure.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-slate-800">Every number, labeled</div>
        <div className="space-y-2">
          {BDHCQ_EFFORT_CURVE.map((p) => (
            <div key={p.effort} className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
              <span className="w-20 shrink-0 font-semibold text-slate-800">{p.label}</span>
              <span className="w-16 shrink-0 font-mono text-slate-700">{p.pass2 ?? "—"}%</span>
              {p.status === "developer-reported" ? <DeveloperReportedBadge /> : <NeedsVerificationBadge />}
              <span className="text-slate-500">{p.note}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {BDHCQ_KEY_CLAIMS.map((c, i) => (
            <div key={i} className="rounded-lg border border-slate-100 p-2.5 text-xs text-slate-600">
              <div className="italic text-slate-700">"{c.claim}"</div>
              <div className="mt-1 flex items-center gap-2 text-slate-400">
                <span>{c.source}</span>
                {c.status === "developer-reported" ? <DeveloperReportedBadge /> : <NeedsVerificationBadge />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{BDH_VS_BDHCQ.bdhcq.name}</div>
          <div className="mt-1 text-sm font-semibold text-indigo-950">{BDH_VS_BDHCQ.bdhcq.role}</div>
          <p className="mt-2 text-xs leading-relaxed text-indigo-900">{BDH_VS_BDHCQ.bdhcq.mechanism}</p>
          <p className="mt-2 text-[11px] text-indigo-500">{BDH_VS_BDHCQ.bdhcq.source}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{BDH_VS_BDHCQ.bdh.name}</div>
          <div className="mt-1 text-sm font-semibold text-slate-800">{BDH_VS_BDHCQ.bdh.role}</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">{BDH_VS_BDHCQ.bdh.mechanism}</p>
          <p className="mt-2 text-[11px] text-slate-400">{BDH_VS_BDHCQ.bdh.source}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{BDH_VS_BDHCQ.note}</p>

      <PrevNext onPrev={onPrev} onNext={onNext} nextLabel="Limitations & misconceptions" />
    </section>
  );
}
