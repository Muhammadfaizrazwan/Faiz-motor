"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MotorCard } from "@/components/user/MotorCard";
import { FilterSidebar, type FilterState } from "@/components/user/FilterSidebar";
import { EmptyState } from "@/components/user/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Bike,
} from "lucide-react";
import api from "@/lib/axios";
import type { Motor, PaginationMeta } from "@/types";

function MotorListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<FilterState>({
    brand: searchParams.get("brand") || "",
    condition: searchParams.get("condition") || "",
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    yearMin: searchParams.get("yearMin") || "",
    yearMax: searchParams.get("yearMax") || "",
  });

  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  const fetchMotors = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12, sort };
      if (filters.brand) params.brand = filters.brand;
      if (filters.condition) params.condition = filters.condition;
      if (filters.status) params.status = filters.status;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.yearMin) params.year = filters.yearMin;

      const res = await api.get("/motors", { params });
      setMotors(res.data.data);
      setMeta(res.data.meta);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => {
    fetchMotors();
  }, [fetchMotors]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.condition) params.set("condition", filters.condition);
    if (filters.status) params.set("status", filters.status);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/motors${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [filters, sort, page, router]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ brand: "", condition: "", status: "", minPrice: "", maxPrice: "", yearMin: "", yearMax: "" });
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1628]">Daftar Motor</h1>
        <p className="text-sm text-[#64748B] mt-1">Temukan motor yang sesuai kebutuhan Anda</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <Input
                placeholder="Cari nama motor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden rounded-xl gap-2"
                onClick={() => setShowMobileFilter(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </Button>

              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-xl border border-slate-200 text-xs text-[#0A1628] bg-white focus:ring-2 focus:ring-[#E8390E] outline-none"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="popular">Populer</option>
              </select>

              <span className="text-xs text-[#64748B] ml-auto sm:ml-2 whitespace-nowrap">
                {meta.total} motor ditemukan
              </span>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-32 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : motors.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
              {motors
                .filter((m) =>
                  searchQuery
                    ? m.name.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
                )
                .map((motor) => (
                  <MotorCard key={motor.id} motor={motor} />
                ))}
            </div>
          ) : (
            <EmptyState
              icon={Bike}
              title="Tidak Ada Motor Ditemukan"
              description="Coba ubah filter pencarian atau reset semua filter"
              actionLabel="Reset Filter"
              actionHref="/motors"
            />
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).slice(
                Math.max(0, page - 3),
                Math.min(meta.totalPages, page + 2)
              ).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={`rounded-xl w-9 h-9 ${p === page ? "bg-[#E8390E] hover:bg-[#d13009]" : ""}`}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-xl"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {showMobileFilter && (
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          onClose={() => setShowMobileFilter(false)}
          isMobile
        />
      )}
    </div>
  );
}

export default function MotorsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10"><Skeleton className="h-8 w-48 mb-6" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}</div></div>}>
      <MotorListingContent />
    </Suspense>
  );
}
