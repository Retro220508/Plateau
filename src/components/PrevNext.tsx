interface PrevNextProps {
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}

export default function PrevNext({ onPrev, onNext, prevLabel = "Back", nextLabel = "Continue" }: PrevNextProps) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
      <button
        onClick={onPrev}
        disabled={!onPrev}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-0"
      >
        ← {prevLabel}
      </button>
      <button
        onClick={onNext}
        disabled={!onNext}
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-0"
      >
        {nextLabel} →
      </button>
    </div>
  );
}
