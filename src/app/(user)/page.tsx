import Link from "next/link";
import prisma from "@/lib/prisma";
import { MotorCard } from "@/components/user/MotorCard";
import { ReviewCard } from "@/components/user/ReviewCard";
import type { Motor, Review } from "@/types";
import { ArrowRight, Bike, MessageCircle, Star, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Faiz Motor — Marketplace Motor Terpercaya",
  description: "Temukan motor impianmu di Faiz Motor. Marketplace motor baru dan bekas terpercaya dengan harga terbaik di Indonesia.",
};

export const dynamic = 'force-dynamic';

const BRAND_LIST = [
  { name: "Honda", color: "from-red-500 to-red-600" },
  { name: "Yamaha", color: "from-blue-500 to-blue-600" },
  { name: "Suzuki", color: "from-sky-500 to-sky-600" },
  { name: "Kawasaki", color: "from-emerald-500 to-emerald-600" },
  { name: "Vespa", color: "from-teal-500 to-teal-600" },
];

export default async function HomePage() {
  // Fetch latest motors
  const motorsRaw = await prisma.motor.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      photos: { where: { isPrimary: true }, take: 1 },
      _count: { select: { reviews: { where: { status: "APPROVED" } }, savedByUsers: true } },
    },
  });
  const motors = JSON.parse(JSON.stringify(motorsRaw)) as Motor[];

  // Fetch approved reviews
  const reviewsRaw = await prisma.review.findMany({
    where: { status: "APPROVED" },
    include: { user: { select: { id: true, name: true } }, motor: { select: { id: true, name: true, brand: true } } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const reviews = JSON.parse(JSON.stringify(reviewsRaw)) as Review[];

  // Stats
  const [totalMotors, totalSold] = await Promise.all([
    prisma.motor.count(),
    prisma.motor.count({ where: { status: "TERJUAL" } }),
  ]);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-[#0A1628] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-[#E8390E]/20 to-transparent rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Grid dots pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium text-white/80 mb-6 border border-white/5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8390E]" />
              Marketplace Motor Terpercaya
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Temukan Motor{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8390E] to-[#FF6B3D]">
                Impianmu
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed px-2 sm:px-0">
              Jual beli motor baru dan bekas dengan harga terbaik. Ribuan pilihan motor dari berbagai merek ternama.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 mt-6 sm:mt-8 mb-6 sm:mb-8">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-white">{totalMotors}+</p>
                <p className="text-xs text-slate-400">Motor Tersedia</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-white">{totalSold}+</p>
                <p className="text-xs text-slate-400">Terjual</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-white">4.8</p>
                <p className="text-xs text-slate-400">Rating</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
              <Link href="/motors" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-[#E8390E] hover:bg-[#d13009] text-white rounded-xl gap-2 shadow-lg shadow-[#E8390E]/25 text-sm sm:text-base font-semibold px-8 h-12">
                  <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                  Lihat Semua Motor
                </Button>
              </Link>
              <Link href="/motors?condition=BARU" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-xl gap-2 text-sm sm:text-base font-semibold px-8 h-12 border-white/40 text-white hover:bg-white hover:text-[#0A1628]">
                  Motor Baru
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute -bottom-px left-0 right-0 leading-[0]">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-auto block">
            <path d="M0 60L48 52C96 44 192 28 288 24C384 20 480 28 576 32C672 36 768 36 864 32C960 28 1056 20 1152 20C1248 20 1344 28 1392 32L1440 36V60H0Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ===== MOTOR TERBARU ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex items-end justify-between mb-5 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1628]">Motor Terbaru</h2>
            <p className="text-sm text-[#64748B] mt-1">Lihat koleksi motor terbaru kami</p>
          </div>
          <Link href="/motors" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E8390E] hover:underline">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {motors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {motors.map((motor) => (
              <MotorCard key={motor.id} motor={motor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#64748B]">
            <Bike className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Belum ada motor tersedia</p>
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link href="/motors">
            <Button className="bg-[#E8390E] hover:bg-[#d13009] rounded-xl gap-2">
              Lihat Semua Motor <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== KATEGORI BY BRAND ===== */}
      <section className="bg-white py-8 sm:py-12 lg:py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1628]">Cari Berdasarkan Merek</h2>
            <p className="text-sm text-[#64748B] mt-1">Pilih merek motor favorit Anda</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {BRAND_LIST.map((brand) => (
              <Link
                key={brand.name}
                href={`/motors?brand=${brand.name}`}
                className="group relative bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 text-center hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center shadow-lg`}>
                  <Bike className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-sm font-bold text-[#0A1628] group-hover:text-[#E8390E] transition-colors">{brand.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-[#64748B] group-hover:text-[#E8390E] transition-colors">
                  Lihat Motor <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONI ===== */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium text-amber-700 mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Ulasan Pelanggan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1628]">Apa Kata Mereka?</h2>
            <p className="text-sm text-[#64748B] mt-1">Testimoni dari pelanggan setia Faiz Motor</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <div className="relative bg-gradient-to-r from-[#0A1628] to-[#1E3A5F] rounded-2xl sm:rounded-3xl overflow-hidden px-5 sm:px-12 py-8 sm:py-16">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <div className="relative text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Tertarik dengan Motor Kami?</h2>
            <p className="text-slate-400 text-xs sm:text-base mb-4 sm:mb-6">Hubungi kami sekarang untuk informasi lebih lanjut atau kunjungi showroom kami.</p>
            <a
              href="https://wa.me/6282125428638?text=Halo%20Faiz%20Motor%2C%20saya%20tertarik%20dengan%20motor%20di%20website%20Anda"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-[#25D366] hover:bg-[#1EBE57] text-white rounded-xl gap-2 shadow-lg shadow-[#25D366]/25 text-base font-semibold">
                <MessageCircle className="w-5 h-5" />
                Hubungi via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
