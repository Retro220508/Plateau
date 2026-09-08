export interface StageMeta {
  key: string;
  short: string;
}

interface StageNavProps {
  stages: StageMeta[];
  current: number;
  onSelect: (i: number) => void;
}

export default function StageNav({ stages, current, onSelect }: StageNavProps) {
  return (
    <nav className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2 sm:px-6" style={{ scrollbarWidth: "thin" }}>
        {stages.map((s, i) => {
          const active = i === current;
          const visited = i <= current;
          return (
            <button
              key={s.key}
              onClick={() => onSelect(i)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : visited
                    ? "bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100"
                    : "bg-white/60 text-slate-400 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  active ? "bg-white/25" : "bg-slate-100 text-slate-500"
                }`}
              >
                {i}
              </span>
              {s.short}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
