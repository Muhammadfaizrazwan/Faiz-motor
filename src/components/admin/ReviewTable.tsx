"use client";

import { useState } from "react";
import { formatRupiah, formatDateShort, truncate } from "@/lib/format";
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
import { CheckCircle, XCircle, Trash2, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  motor: { id: string; name: string; brand: string };
}

interface ReviewTableProps {
  data: Review[];
  onModerate: (id: string, status: "APPROVED" | "REJECTED") => void;
  onDelete: (id: string) => void;
  isProcessing: string | null;
}

export function ReviewTable({ data, onModerate, onDelete, isProcessing }: ReviewTableProps) {
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "approve" | "reject" | "delete";
  } | null>(null);

  const handleConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") onModerate(confirmAction.id, "APPROVED");
    else if (confirmAction.type === "reject") onModerate(confirmAction.id, "REJECTED");
    else if (confirmAction.type === "delete") onDelete(confirmAction.id);

    setConfirmAction(null);
  };

  const getDialogConfig = () => {
    if (!confirmAction) return { title: "", description: "", variant: "default" as const };
    if (confirmAction.type === "approve") {
      return {
        title: "Setujui Ulasan",
        description: "Ulasan ini akan ditampilkan di halaman publik motor terkait.",
        variant: "default" as const,
        confirmLabel: "Setujui",
      };
    }
    if (confirmAction.type === "reject") {
      return {
        title: "Tolak Ulasan",
        description: "Ulasan ini akan ditolak dan tidak akan ditampilkan ke publik.",
        variant: "warning" as const,
        confirmLabel: "Tolak",
      };
    }
    return {
      title: "Hapus Ulasan",
      description: "Ulasan ini akan dihapus secara permanen dari sistem.",
      variant: "danger" as const,
      confirmLabel: "Hapus",
    };
  };

  const dialogConfig = getDialogConfig();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Pengulas</TableHead>
              <TableHead className="font-semibold text-slate-700">Motor</TableHead>
              <TableHead className="font-semibold text-slate-700">Rating & Ulasan</TableHead>
              <TableHead className="font-semibold text-slate-700">Tanggal</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  Tidak ada ulasan ditemukan
                </TableCell>
              </TableRow>
            ) : (
              data.map((review) => (
                <TableRow key={review.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <p className="font-medium text-slate-800">{review.user.name}</p>
                    <p className="text-xs text-slate-500">{review.user.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-800">{review.motor.name}</p>
                    <p className="text-xs text-slate-500">{review.motor.brand}</p>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-300 fill-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 truncate" title={review.comment}>
                      "{review.comment}"
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDateShort(review.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={review.status} type="review" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {review.status !== "APPROVED" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setConfirmAction({ id: review.id, type: "approve" })}
                          disabled={isProcessing === review.id}
                          className="w-8 h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          title="Setujui"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {review.status !== "REJECTED" && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setConfirmAction({ id: review.id, type: "reject" })}
                          disabled={isProcessing === review.id}
                          className="w-8 h-8 text-amber-600 border-amber-200 hover:bg-amber-50"
                          title="Tolak"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setConfirmAction({ id: review.id, type: "delete" })}
                        disabled={isProcessing === review.id}
                        className="w-8 h-8 text-red-600 border-red-200 hover:bg-red-50"
                        title="Hapus Permanen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
