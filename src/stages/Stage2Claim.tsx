import { useState } from "react";
import PrevNext from "../components/PrevNext";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Stage2Claim({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [vote, setVote] = useLocalStorage<string | null>("plateau.claimVote", null);
  const [justSet, setJustSet] = useState(false);

  return (
    <section id="claim" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">The claim</div>
      <blockquote className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-xl font-semibold leading-snug text-indigo-950 sm:text-2xl">
        "On an unseen abstract-reasoning puzzle, model accuracy improves with each added recurrent
        latent-refinement step — but only up to the model's fixed state capacity, after which additional steps stop
        helping and can degrade the answer."
      </blockquote>

      <p className="mt-6 text-sm text-slate-600">
        Notice the shape of this sentence: it makes <strong>two</strong> predictions, not one — a rise, and then a
        plateau or fall. That's on purpose. A claim that can only ever look "confirmed" no matter what you do to it
        isn't teaching you anything falsifiable. This one can fail in front of you, and in Stage 3 you'll try to
        make it fail.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-800">Before you test it: do you think this always holds?</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Yes, more steps should always help", "No, I expect a ceiling", "Not sure yet"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setVote(opt);
                setJustSet(true);
                setTimeout(() => setJustSet(false), 1200);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                vote === opt
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {vote && (
          <div className={`mt-3 text-xs text-slate-400 transition-opacity ${justSet ? "opacity-100" : "opacity-70"}`}>
            Recorded locally on your device — no grading, just a prediction to check against Stage 3. You can change
            it any time.
          </div>
        )}
      </div>

      <PrevNext onPrev={onPrev} onNext={onNext} nextLabel="Test it on an unseen puzzle" />
    </section>
  );
}
