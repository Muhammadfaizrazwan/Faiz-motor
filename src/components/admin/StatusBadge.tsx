"use client";

import { Badge } from "@/components/ui/badge";

type StatusType = "motor" | "review" | "user";

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Motor statuses
  TERSEDIA: {
    label: "Tersedia",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  DIPESAN: {
    label: "Dipesan",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  TERJUAL: {
    label: "Terjual",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  // Review statuses
  PENDING: {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Disetujui",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  // User statuses
  ACTIVE: {
    label: "Aktif",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  BLOCKED: {
    label: "Diblokir",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  // Motor conditions
  BARU: {
    label: "Baru",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  BEKAS: {
    label: "Bekas",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2.5 py-0.5 ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
