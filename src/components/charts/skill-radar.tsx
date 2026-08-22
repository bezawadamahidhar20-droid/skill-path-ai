"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

export function SkillRadar({
  data,
}: {
  data: { skill: string; current: number; target?: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#E6DED7" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#686868" }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#686868" }} />
        <Radar name="Current" dataKey="current" stroke="#7D4047" fill="#7D4047" fillOpacity={0.35} animationDuration={800} />
        {data[0]?.target !== undefined ? (
          <Radar name="Target" dataKey="target" stroke="#9A6A27" fill="#9A6A27" fillOpacity={0.08} animationDuration={800} />
        ) : null}
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
