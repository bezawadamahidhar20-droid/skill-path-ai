"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatDate } from "@/lib/utils";

export function TrendChart({ data }: { data: { createdAt: string; score: number | null }[] }) {
  const chartData = data
    .filter((d) => d.score !== null)
    .map((d) => ({ date: formatDate(d.createdAt), score: d.score }));

  if (chartData.length < 2) {
    return (
      <div className="flex h-56 items-center justify-center text-center text-sm text-text-secondary">
        Complete another assessment to see your readiness trend over time.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E6DED7" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#686868" }} axisLine={{ stroke: "#E6DED7" }} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#686868" }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #E6DED7", fontSize: 13 }}
          labelStyle={{ color: "#252525", fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#7D4047"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#7D4047" }}
          activeDot={{ r: 6 }}
          animationDuration={900}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
