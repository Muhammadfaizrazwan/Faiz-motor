"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PopularMotor {
  id: string;
  name: string;
  brand: string;
  viewCount: number;
}

const COLORS = ["#E8390E", "#F97316", "#FBBF24", "#34D399", "#60A5FA"];

export function PopularMotors({ data }: { data: PopularMotor[] }) {
  const chartData = data.map((m) => ({
    name: m.name.length > 20 ? m.name.slice(0, 20) + "..." : m.name,
    views: m.viewCount,
    fullName: m.name,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-base font-semibold text-slate-800 mb-6">
        Top 5 Motor Paling Dilihat
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" barSize={24}>
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            width={160}
            tick={{ fontSize: 12, fill: "#475569" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
            formatter={(value: any) => [`${Number(value).toLocaleString("id-ID")} views`, "Dilihat"]}
          />
          <Bar dataKey="views" radius={[0, 6, 6, 0]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
