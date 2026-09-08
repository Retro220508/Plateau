import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BDHCQ_EFFORT_CURVE } from "../lib/bdhcqData";

export default function BdhcqEffortChart({ height = 260 }: { height?: number }) {
  const data = BDHCQ_EFFORT_CURVE.map((p) => ({
    label: p.label,
    pass2: p.pass2 ?? 0,
    status: p.status,
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis
            domain={[0, 40]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{ value: "ARC-AGI-1 pass@2 %", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8" }}
          />
          <Tooltip formatter={(v) => [`${v}%`, "pass@2"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="pass2" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.status === "developer-reported" ? "#8b5cf6" : "#fda4af"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
