"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { OrderTable } from "@/components/admin/OrderTable";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface SavedMotor {
  motorId: string;
  userId: string;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string | null };
  motor: { id: string; name: string; brand: string; price: number; status: string };
}

export default function OrdersPage() {
  const [data, setData] = useState<SavedMotor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchData = useCallback(async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await api.get("/admin/saved", { params: { search: searchQuery, limit: 50 } });
      setData(res.data.data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, fetchData]);

  const handleUpdateStatus = async (motorId: string, newStatus: "TERSEDIA" | "DIPESAN" | "TERJUAL") => {
    setIsProcessing(motorId);
    try {
      await api.patch(`/motors/${motorId}/status`, { status: newStatus });
      toast.success("Status motor berhasil diperbarui");
      await fetchData(search);
    } catch {
      // handled
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari nama pelanggan atau motor..."
            className="pl-9 h-10 border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <EmptyState
            icon={<ShoppingCart className="w-12 h-12 text-slate-300" />}
            title="Tidak ada pesanan"
            description="Belum ada user yang menyimpan motor ke keranjang, atau pencarian tidak ditemukan."
          />
        </div>
      ) : (
        <OrderTable
          data={data}
          onUpdateStatus={handleUpdateStatus}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
