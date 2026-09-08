import type { Grid } from "../lib/grid";

export const COLOR_PALETTE = ["#f97316", "#0ea5e9", "#10b981", "#f43f5e", "#a855f7"];

interface GridViewProps {
  grid: Grid;
  compareGrid?: Grid;
  cellSize?: number;
  dim?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function GridView({
  grid,
  compareGrid,
  cellSize = 30,
  dim = false,
  title,
  subtitle,
  className = "",
}: GridViewProps) {
  const n = grid.length;
  const size = n * cellSize;

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      {title && <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>}
      <svg
        width={size}
        height={size}
        className={`rounded-lg border border-slate-200 shadow-sm transition-opacity ${dim ? "opacity-40" : ""}`}
      >
        {grid.map((row, r) =>
          row.map((val, c) => {
            const mismatched = compareGrid ? compareGrid[r][c] !== val : false;
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={COLOR_PALETTE[val] ?? "#e2e8f0"}
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth={1.5}
                />
                {mismatched && (
                  <rect
                    x={c * cellSize + 2}
                    y={r * cellSize + 2}
                    width={cellSize - 4}
                    height={cellSize - 4}
                    fill="none"
                    stroke="#fff"
                    strokeDasharray="3 2"
                    strokeWidth={2}
                    rx={3}
                  />
                )}
              </g>
            );
          }),
        )}
      </svg>
      {subtitle && <div className="text-[11px] text-slate-400">{subtitle}</div>}
    </div>
  );
}
