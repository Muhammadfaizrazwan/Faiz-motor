"use client";

import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import type { Motor } from "@/types";
import { Eye, Calendar, Palette } from "lucide-react";

interface MotorCardProps {
  motor: Motor;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  TERSEDIA: {
    label: "Tersedia",
    className: "bg-emerald-500 text-white",
  },
  DIPESAN: {
    label: "Dipesan",
    className: "bg-amber-500 text-white",
  },
  TERJUAL: {
    label: "Terjual",
    className: "bg-red-500 text-white",
  },
};

export function MotorCard({ motor }: MotorCardProps) {
  const primaryPhoto = motor.photos?.find((p) => p.isPrimary) || motor.photos?.[0];
  const status = statusConfig[motor.status] || statusConfig.TERSEDIA;

  return (
    <Link href={`/motors/${motor.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.url}
              alt={motor.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <Eye className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <span className="text-xs text-slate-400">Belum ada foto</span>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Condition Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm ${
                motor.condition === "BARU"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-600 text-white"
              }`}
            >
              {motor.condition === "BARU" ? "Baru" : "Bekas"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Brand */}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#E8390E] mb-1">
            {motor.brand}
          </p>

          {/* Name */}
          <h3 className="text-sm font-bold text-[#0A1628] line-clamp-1 group-hover:text-[#E8390E] transition-colors">
            {motor.name}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {motor.year}
            </span>
            <span className="flex items-center gap-1">
              <Palette className="w-3 h-3" />
              {motor.color}
            </span>
          </div>

          {/* Price */}
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100">
            <p className="text-sm sm:text-base font-extrabold text-[#0A1628]">
              {formatRupiah(motor.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
