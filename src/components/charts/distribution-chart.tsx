"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function DistributionChart({ data }: { data: { bucket: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -20 }}>
        <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: "#686868" }} axisLine={{ stroke: "#E6DED7" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#686868" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E6DED7", fontSize: 13 }} />
        <Bar dataKey="total" fill="#7D4047" radius={[6, 6, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}
