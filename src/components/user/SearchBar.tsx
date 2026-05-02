"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const BRANDS = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Vespa"];
const CONDITIONS = [
  { value: "", label: "Semua" },
  { value: "BARU", label: "Baru" },
  { value: "BEKAS", label: "Bekas" },
];

export function SearchBar() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (condition) params.set("condition", condition);
    router.push(`/motors?${params.toString()}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Brand Select */}
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="flex-1 h-11 px-4 rounded-xl bg-white/90 text-sm text-[#0A1628] border-0 focus:ring-2 focus:ring-[#E8390E] outline-none"
        >
          <option value="">Semua Merek</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Condition Select */}
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="flex-1 h-11 px-4 rounded-xl bg-white/90 text-sm text-[#0A1628] border-0 focus:ring-2 focus:ring-[#E8390E] outline-none"
        >
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-11 px-6 bg-[#E8390E] hover:bg-[#d13009] rounded-xl gap-2 shadow-lg shadow-[#E8390E]/30 text-sm font-semibold"
        >
          <Search className="w-4 h-4" />
          Cari Motor
        </Button>
      </div>
    </div>
  );
}
