import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { formatRupiah, formatDate } from "@/lib/format";
import { Calendar, Palette, Gauge, Eye, Tag } from "lucide-react";
import { MotorDetailClient } from "./client";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const motor = await prisma.motor.findUnique({ where: { id }, select: { name: true, brand: true, price: true } });
  if (!motor) return { title: "Motor Tidak Ditemukan" };
  return {
    title: `${motor.name} — ${motor.brand}`,
    description: `Beli ${motor.name} ${motor.brand} dengan harga ${formatRupiah(motor.price)} di MotoMart`,
  };
}

export default async function MotorDetailPage({ params }: Props) {
  const { id } = await params;

  const motor = await prisma.motor.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { isPrimary: "desc" } },
      _count: { select: { reviews: { where: { status: "APPROVED" } }, savedByUsers: true } },
    },
  });

  if (!motor) notFound();

  // Increment view count in background
  prisma.motor.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const motorData = JSON.parse(JSON.stringify(motor));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
        <a href="/" className="hover:text-[#E8390E] transition-colors">Beranda</a>
        <span>/</span>
        <a href="/motors" className="hover:text-[#E8390E] transition-colors">Motor</a>
        <span>/</span>
        <span className="text-[#0A1628] font-medium truncate">{motor.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Photo Gallery (rendered in client component) */}
        <div>
          <MotorDetailClient motor={motorData} section="gallery" />
        </div>

        {/* Right: Motor Info */}
        <div className="space-y-6">
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8390E] bg-[#E8390E]/8 px-3 py-1 rounded-full">
              {motor.brand}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              motor.status === "TERSEDIA" ? "bg-emerald-50 text-emerald-700" :
              motor.status === "DIPESAN" ? "bg-amber-50 text-amber-700" :
              "bg-red-50 text-red-700"
            }`}>
              {motor.status === "TERSEDIA" ? "Tersedia" : motor.status === "DIPESAN" ? "Dipesan" : "Terjual"}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] leading-tight">{motor.name}</h1>

          {/* Price */}
          <div className="bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] rounded-2xl p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Harga</p>
            <p className="text-3xl font-extrabold text-white">{formatRupiah(motor.price)}</p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: "Tahun", value: motor.year },
              { icon: Palette, label: "Warna", value: motor.color },
              { icon: Gauge, label: "Kondisi", value: motor.condition === "BARU" ? "Baru" : "Bekas" },
              { icon: Eye, label: "Dilihat", value: `${motor.viewCount}x` },
              { icon: Tag, label: "Ditambahkan", value: formatDate(motor.createdAt) },
            ].map((spec) => (
              <div key={spec.label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <spec.icon className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-medium">{spec.label}</span>
                </div>
                <p className="text-sm font-semibold text-[#0A1628]">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons (client component) */}
          <MotorDetailClient motor={motorData} section="actions" />
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-10">
        <MotorDetailClient motor={motorData} section="tabs" />
      </div>
    </div>
  );
}
