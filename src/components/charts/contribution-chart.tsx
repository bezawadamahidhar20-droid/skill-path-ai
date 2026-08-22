"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function ContributionChart({ data }: { data: { label: string; value: number }[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 8);
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, sorted.length * 34)}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
        <XAxis type="number" hide domain={[0, "dataMax + 2"]} />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tick={{ fontSize: 12, fill: "#252525" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #E6DED7", fontSize: 13 }}
          formatter={(v) => [`+${v}`, "Contribution"]}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={800}>
          {sorted.map((entry, index) => (
            <Cell key={index} fill="#7D4047" fillOpacity={1 - index * 0.07} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
