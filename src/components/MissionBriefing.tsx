import { useState } from "react";

const OBJECTIVES = [
  "State the one-sentence claim in your own words.",
  "Predict, before running it, whether more compute steps will help, hurt, or plateau on a given puzzle.",
  "Locate where this mechanism appears in BDH-CQ, and how it differs from BDH's mechanism.",
  "Name one limitation (capacity ceiling / no verbal interpretability of intermediate steps).",
];

export default function MissionBriefing() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-500 hover:text-indigo-600"
        >
          <span>Mission briefing — audience, prerequisites &amp; objectives</span>
          <span>{open ? "hide ▲" : "show ▼"}</span>
        </button>
        {open && (
          <div className="grid grid-cols-1 gap-4 py-3 text-xs text-slate-600 sm:grid-cols-3">
            <div>
              <div className="font-semibold text-slate-800">Audience</div>
              <p className="mt-1">
                ML-literate undergrads / early grad students who know what a hidden state and a transformer are.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-800">Prerequisites</div>
              <p className="mt-1">
                Basic RNN/attention familiarity. No chain-of-thought-specific background assumed.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-800">Your mission</div>
              <ul className="mt-1 space-y-1">
                {OBJECTIVES.map((o, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-indigo-500">{i + 1}.</span> {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
