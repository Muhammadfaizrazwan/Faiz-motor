"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSaved } from "@/hooks/useSaved";
import { useAuthStore } from "@/store/authStore";
import { EmptyState } from "@/components/user/EmptyState";
import { UserStatusBadge } from "@/components/user/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import {
  ShoppingCart,
  Trash2,
  ExternalLink,
  AlertTriangle,
  XCircle,
  Loader2,
  Bike,
} from "lucide-react";
import { useState } from "react";

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { savedMotors, loading, fetchSaved, removeSaved } = useSaved();
  const { setSavedCount } = useAuthStore();
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchSaved();
    }
  }, [session, fetchSaved]);

  useEffect(() => {
    setSavedCount(savedMotors.length);
  }, [savedMotors.length, setSavedCount]);

  const handleRemove = async (motorId: string) => {
    setRemovingId(motorId);
    await removeSaved(motorId);
    setRemovingId(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4">
              <Skeleton className="w-28 h-20 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <ShoppingCart className="w-6 h-6 text-[#E8390E]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1628]">Keranjang Saya</h1>
        </div>
        <p className="text-sm text-[#64748B]">
          {savedMotors.length > 0
            ? `${savedMotors.length} motor tersimpan`
            : "Belum ada motor tersimpan"}
        </p>
      </div>

      {savedMotors.length === 0 ? (
        <EmptyState
          icon={Bike}
          title="Keranjang Kosong"
          description="Anda belum menyimpan motor apapun. Mulai jelajahi motor yang tersedia."
          actionLabel="Cari Motor"
          actionHref="/motors"
        />
      ) : (
        <div className="space-y-4">
          {savedMotors.map((saved) => {
            const motor = saved.motor;
            const primaryPhoto = motor.photos?.find((p) => p.isPrimary) || motor.photos?.[0];
            const isDipesan = motor.status === "DIPESAN";
            const isTerjual = motor.status === "TERJUAL";

            return (
              <div
                key={saved.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  isTerjual ? "border-red-200" : isDipesan ? "border-amber-200" : "border-slate-100"
                }`}
              >
                {/* Warning Banner */}
                {isDipesan && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Motor ini sudah dipesan oleh orang lain
                  </div>
                )}
                {isTerjual && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-b border-red-100 text-xs text-red-700 font-medium">
                    <XCircle className="w-3.5 h-3.5" />
                    Motor ini sudah terjual
                  </div>
                )}

                <div className="p-4 flex flex-col sm:flex-row gap-4">
                  {/* Photo */}
                  <Link href={`/motors/${motor.id}`} className="shrink-0">
                    <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-slate-100">
                      {primaryPhoto ? (
                        <Image
                          src={primaryPhoto.url}
                          alt={motor.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bike className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#E8390E]">{motor.brand}</p>
                        <Link href={`/motors/${motor.id}`} className="hover:text-[#E8390E] transition-colors">
                          <h3 className="text-sm font-bold text-[#0A1628] line-clamp-1">{motor.name}</h3>
                        </Link>
                        <p className="text-xs text-[#64748B] mt-0.5">{motor.year} • {motor.color} • {motor.condition === "BARU" ? "Baru" : "Bekas"}</p>
                      </div>
                      <UserStatusBadge status={motor.status} size="sm" />
                    </div>

                    <p className="text-base font-extrabold text-[#0A1628] mt-2">{formatRupiah(motor.price)}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <Link href={`/motors/${motor.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                          <ExternalLink className="w-3 h-3" /> Lihat Detail
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(motor.id)}
                        disabled={removingId === motor.id}
                        className="rounded-xl text-xs gap-1.5 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        {removingId === motor.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
