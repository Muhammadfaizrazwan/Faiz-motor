"use client";

import { useState } from "react";
import { formatDateShort } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  _count?: { reviews: number; savedMotors: number };
}

interface UserTableProps {
  data: User[];
  onToggleStatus: (id: string, status: "ACTIVE" | "BLOCKED") => void;
  isProcessing: string | null;
}

export function UserTable({ data, onToggleStatus, isProcessing }: UserTableProps) {
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "block" | "activate";
  } | null>(null);

  const handleConfirm = () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === "block") onToggleStatus(confirmAction.id, "BLOCKED");
    else onToggleStatus(confirmAction.id, "ACTIVE");
    
    setConfirmAction(null);
  };

  const getDialogConfig = () => {
    if (!confirmAction) return { title: "", description: "", variant: "default" as const };
    if (confirmAction.type === "block") {
      return {
        title: "Blokir User",
        description: "User tidak akan bisa login atau melakukan aktivitas di MotoMart.",
        variant: "danger" as const,
        confirmLabel: "Blokir",
      };
    }
    return {
      title: "Aktifkan User",
      description: "User akan mendapatkan kembali akses penuh ke MotoMart.",
      variant: "default" as const,
      confirmLabel: "Aktifkan",
    };
  };

  const dialogConfig = getDialogConfig();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Informasi User</TableHead>
              <TableHead className="font-semibold text-slate-700">Kontak</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Aktivitas</TableHead>
              <TableHead className="font-semibold text-slate-700">Mendaftar Pada</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  Tidak ada user ditemukan
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <p className="font-medium text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {user.role === "ADMIN" ? "Administrator" : "Customer"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-800">{user.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user.phone || "-"}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center justify-center text-xs text-slate-600 gap-1">
                      <span>{user._count?.reviews || 0} Ulasan</span>
                      <span>{user._count?.savedMotors || 0} Disimpan</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDateShort(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} type="user" />
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== "ADMIN" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setConfirmAction({
                            id: user.id,
                            type: user.status === "ACTIVE" ? "block" : "activate",
                          })
                        }
                        disabled={isProcessing === user.id}
                        className={
                          user.status === "ACTIVE"
                            ? "text-red-600 border-red-200 hover:bg-red-50"
                            : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        }
                      >
                        {user.status === "ACTIVE" ? (
                          <>
                            <UserX className="w-4 h-4 mr-1.5" />
                            Blokir
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-1.5" />
                            Aktifkan
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={dialogConfig.title}
        description={dialogConfig.description}
        confirmLabel={dialogConfig.confirmLabel}
        variant={dialogConfig.variant}
        loading={isProcessing === confirmAction?.id}
        onConfirm={handleConfirm}
      />
    </>
  );
}
