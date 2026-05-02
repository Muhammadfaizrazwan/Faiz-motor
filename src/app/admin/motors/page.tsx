"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMotors } from "@/hooks/useMotors";
import { MotorTable } from "@/components/admin/MotorTable";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bike, Plus, Search } from "lucide-react";

const BRANDS = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Vespa", "Lainnya"];
const STATUSES = [
  { value: "TERSEDIA", label: "Tersedia" },
  { value: "DIPESAN", label: "Dipesan" },
  { value: "TERJUAL", label: "Terjual" },
];
const CONDITIONS = [
  { value: "BARU", label: "Baru" },
  { value: "BEKAS", label: "Bekas" },
];

export default function MotorsPage() {
  const { motors, loading, fetchMotors, deleteMotor } = useMotors();
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState("all");
  const [condition, setCondition] = useState("all");

  useEffect(() => {
    // Only search by brand/status/condition via API for now
    // Client side filtering for text search to avoid excessive API calls
    const params: Record<string, string> = {};
    if (brand !== "all") params.brand = brand;
    if (status !== "all") params.status = status;
    if (condition !== "all") params.condition = condition;
    
    fetchMotors(params);
  }, [brand, status, condition, fetchMotors]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteMotor(id);
    await fetchMotors(); // Refresh list
    setIsDeleting(false);
  };

  // Client side search filter
  const filteredMotors = motors.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari nama motor..."
              className="pl-9 h-10 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={brand} onValueChange={(val) => setBrand(val || "all")}>
            <SelectTrigger className="w-full sm:w-[140px] h-10">
              <SelectValue placeholder="Semua Merek" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Merek</SelectItem>
              {BRANDS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(val) => setStatus(val || "all")}>
            <SelectTrigger className="w-full sm:w-[140px] h-10">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={condition} onValueChange={(val) => setCondition(val || "all")}>
            <SelectTrigger className="w-full sm:w-[140px] h-10">
              <SelectValue placeholder="Semua Kondisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kondisi</SelectItem>
              {CONDITIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link href="/admin/motors/add">
          <Button className="w-full sm:w-auto bg-[#E8390E] hover:bg-[#d13009] shadow-md shadow-[#E8390E]/20">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Motor
          </Button>
        </Link>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : filteredMotors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <EmptyState
            icon={<Bike className="w-12 h-12 text-slate-300" />}
            title="Tidak ada motor ditemukan"
            description="Coba sesuaikan filter pencarian atau tambah motor baru ke dalam sistem."
            actionLabel={motors.length === 0 ? "Tambah Motor Pertama" : undefined}
          />
        </div>
      ) : (
        <MotorTable
          data={filteredMotors}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
