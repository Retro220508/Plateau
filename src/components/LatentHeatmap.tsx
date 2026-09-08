import { latentToHeatmap } from "../lib/latentModel";

interface LatentHeatmapProps {
  z: number[];
  cellSize?: number;
  className?: string;
}

function colorFor(v: number): string {
  // diverging scale: negative -> indigo, positive -> amber
  const clamped = Math.max(-1, Math.min(1, v));
  if (clamped >= 0) {
    const t = clamped;
    const r = Math.round(255 - (255 - 217) * (1 - t));
    const g = Math.round(255 - (255 - 119) * (1 - t));
    const b = Math.round(255 - (255 - 6) * (1 - t));
    return `rgb(${r},${g},${b})`;
  } else {
    const t = -clamped;
    const r = Math.round(255 - (255 - 67) * (1 - t));
    const g = Math.round(255 - (255 - 56) * (1 - t));
    const b = Math.round(255 - (255 - 202) * (1 - t));
    return `rgb(${r},${g},${b})`;
  }
}

export default function LatentHeatmap({ z, cellSize = 16, className = "" }: LatentHeatmapProps) {
  const map = latentToHeatmap(z, 8);
  const size = 8 * cellSize;
  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <svg width={size} height={size} className="rounded-lg border border-slate-200 shadow-sm">
        {map.map((row, r) =>
          row.map((v, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={colorFor(v * 3)}
            />
          )),
        )}
      </svg>
      <div className="text-[10px] text-slate-400">latent state (64-d, reshaped 8×8, illustrative view)</div>
    </div>
  );
}
