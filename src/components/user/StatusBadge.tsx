"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  TERSEDIA: {
    label: "Tersedia",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
  },
  DIPESAN: {
    label: "Dipesan",
    dot: "bg-amber-500",
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
  },
  TERJUAL: {
    label: "Terjual",
    dot: "bg-red-500",
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
  },
  BARU: {
    label: "Baru",
    dot: "bg-blue-500",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
  },
  BEKAS: {
    label: "Bekas",
    dot: "bg-slate-500",
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-700",
  },
};

export function UserStatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    dot: "bg-gray-500",
    bg: "bg-gray-50 border-gray-200",
    text: "text-gray-700",
  };

  return (
    <Badge
      variant="outline"
      className={`${config.bg} ${config.text} ${
        size === "sm" ? "text-[10px] px-2 py-0" : "text-xs px-2.5 py-0.5"
      } font-medium gap-1.5`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}
