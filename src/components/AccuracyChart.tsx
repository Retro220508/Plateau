import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TRAINING_CAP } from "../lib/latentModel";

interface AccuracyChartProps {
  data: { step: number; accuracy: number }[];
  currentStep?: number;
  height?: number;
}

export default function AccuracyChart({ data, currentStep, height = 260 }: AccuracyChartProps) {
  const chartData = data.map((d) => ({ step: d.step, accuracy: Math.round(d.accuracy * 1000) / 10 }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="step"
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{ value: "refinement steps", position: "insideBottom", offset: -2, fontSize: 11, fill: "#94a3b8" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            label={{ value: "accuracy %", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8" }}
          />
          <Tooltip
            formatter={(v) => [`${v}%`, "accuracy"]}
            labelFormatter={(l) => `step ${l}`}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <ReferenceArea x1={TRAINING_CAP} x2={chartData[chartData.length - 1]?.step ?? TRAINING_CAP + 9} fill="#f43f5e" fillOpacity={0.06} />
          <ReferenceLine
            x={TRAINING_CAP}
            stroke="#f43f5e"
            strokeDasharray="4 3"
            label={{ value: "trained capacity", position: "top", fontSize: 10, fill: "#e11d48" }}
          />
          <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="2 2" />
          {currentStep && (
            <ReferenceLine x={currentStep} stroke="#6366f1" strokeWidth={2} label={{ value: "you are here", position: "insideTopRight", fontSize: 10, fill: "#4f46e5" }} />
          )}
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#4f46e5"
            strokeWidth={2.5}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
