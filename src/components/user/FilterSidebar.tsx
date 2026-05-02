"use client";

import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BRANDS = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Vespa", "Lainnya"];

export interface FilterState {
  brand: string;
  condition: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  yearMin: string;
  yearMax: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({ filters, onFilterChange, onReset, onClose, isMobile = false }: FilterSidebarProps) {
  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#E8390E]" />
          <h3 className="text-sm font-bold text-[#0A1628]">Filter</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="text-xs text-[#64748B] hover:text-[#E8390E] flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          {isMobile && onClose && <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-semibold text-[#0A1628] uppercase tracking-wider">Merek</Label>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="radio" name="brand" checked={filters.brand === brand} onChange={() => onFilterChange("brand", filters.brand === brand ? "" : brand)} className="w-3.5 h-3.5 text-[#E8390E]" />
              <span className="text-sm text-[#0F172A]">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-semibold text-[#0A1628] uppercase tracking-wider">Kondisi</Label>
        <div className="flex gap-2">
          {[{ value: "", label: "Semua" }, { value: "BARU", label: "Baru" }, { value: "BEKAS", label: "Bekas" }].map((opt) => (
            <button key={opt.value} onClick={() => onFilterChange("condition", opt.value)} className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${filters.condition === opt.value ? "bg-[#E8390E] text-white border-[#E8390E]" : "bg-white text-[#64748B] border-slate-200 hover:border-[#E8390E]/30"}`}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-semibold text-[#0A1628] uppercase tracking-wider">Status</Label>
        <div className="flex gap-2 flex-wrap">
          {[{ value: "", label: "Semua" }, { value: "TERSEDIA", label: "Tersedia" }, { value: "DIPESAN", label: "Dipesan" }, { value: "TERJUAL", label: "Terjual" }].map((opt) => (
            <button key={opt.value} onClick={() => onFilterChange("status", opt.value)} className={`py-1.5 px-3 text-xs font-medium rounded-full border transition-all ${filters.status === opt.value ? "bg-[#0A1628] text-white border-[#0A1628]" : "bg-white text-[#64748B] border-slate-200"}`}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-semibold text-[#0A1628] uppercase tracking-wider">Range Harga</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => onFilterChange("minPrice", e.target.value)} className="h-9 text-xs" />
          <Input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => onFilterChange("maxPrice", e.target.value)} className="h-9 text-xs" />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-semibold text-[#0A1628] uppercase tracking-wider">Tahun</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="Dari" value={filters.yearMin} onChange={(e) => onFilterChange("yearMin", e.target.value)} className="h-9 text-xs" />
          <Input type="number" placeholder="Sampai" value={filters.yearMax} onChange={(e) => onFilterChange("yearMax", e.target.value)} className="h-9 text-xs" />
        </div>
      </div>

      {isMobile && <Button onClick={onClose} className="w-full bg-[#E8390E] hover:bg-[#d13009] rounded-xl">Terapkan Filter</Button>}
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">{content}</div>
      </div>
    );
  }

  return <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">{content}</div>;
}
