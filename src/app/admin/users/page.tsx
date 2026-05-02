"use client";

import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { UserTable } from "@/components/admin/UserTable";
import { TableSkeleton } from "@/components/admin/LoadingSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users as UsersIcon } from "lucide-react";

export default function UsersPage() {
  const { users, loading, fetchUsers, toggleUserStatus } = useUsers();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    // Debounce search client-side, but API expects search param
    const timeout = setTimeout(() => {
      const params: any = {};
      if (search) params.search = search;
      if (status !== "ALL") params.status = status;
      fetchUsers(params);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, status, fetchUsers]);

  const handleToggleStatus = async (id: string, newStatus: "ACTIVE" | "BLOCKED") => {
    setIsProcessing(id);
    await toggleUserStatus(id, newStatus);
    // Refresh current view
    const params: any = {};
    if (search) params.search = search;
    if (status !== "ALL") params.status = status;
    await fetchUsers(params);
    setIsProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari nama atau email..."
              className="pl-9 h-10 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={status} onValueChange={(val) => setStatus(val || "ALL")}>
            <SelectTrigger className="w-full sm:w-[150px] h-10">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="ACTIVE">Aktif</SelectItem>
              <SelectItem value="BLOCKED">Diblokir</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <EmptyState
            icon={<UsersIcon className="w-12 h-12 text-slate-300" />}
            title="Tidak ada user"
            description="Tidak ada data user yang sesuai dengan filter pencarian."
          />
        </div>
      ) : (
        <UserTable
          data={users}
          onToggleStatus={handleToggleStatus}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
