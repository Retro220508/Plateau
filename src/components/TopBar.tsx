export default function TopBar({ onOpenHowItWorks }: { onOpenHowItWorks: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M3 17l5-6 4 4 5-8 4 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 20h18" strokeLinecap="round" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight text-slate-900">Plateau</div>
            <div className="text-[11px] text-slate-400">The Latent Refiner · a DataForge 2026 artifact</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHowItWorks}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
          >
            how this actually works
          </button>
          <a
            href="#claim"
            className="hidden rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 sm:inline-block"
          >
            the claim ↓
          </a>
        </div>
      </div>
    </header>
  );
}
