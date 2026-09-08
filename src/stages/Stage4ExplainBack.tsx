import PrevNext from "../components/PrevNext";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Stage4ExplainBack({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [text, setText] = useLocalStorage("plateau.explainBack", "");

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Explain it back</div>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        In your own words: what happened between step 10 and step 18?
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        No grading, no right answer being checked. This is a reflection checkpoint — writing it down is what makes
        it stick. It's saved locally in your browser only.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        placeholder="e.g. Accuracy climbed steadily while the model was inside its trained range, then flattened out and eventually got worse once I pushed past its capacity because..."
        className="mt-5 w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-800 shadow-sm outline-none ring-indigo-200 focus:border-indigo-400 focus:ring-2"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>{text.length} characters</span>
        <span>{text.trim().length > 0 ? "saved locally ✓" : "nothing saved yet"}</span>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        Stuck? Try naming: (1) what the state was doing before the ceiling, (2) what changed structurally at the
        ceiling, (3) what kind of error you saw after it (random-looking noise vs. a confidently wrong answer).
      </div>

      <PrevNext onPrev={onPrev} onNext={onNext} nextLabel="See this at production scale" />
    </section>
  );
}
