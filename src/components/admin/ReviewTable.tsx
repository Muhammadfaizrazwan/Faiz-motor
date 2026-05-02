"use client";

import { useState } from "react";
import { formatDateShort } from "@/lib/format";
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
import { Trash2, Star } from "lucide-react";

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
  onModerate?: (id: string, status: "APPROVED" | "REJECTED") => void;
  onDelete: (id: string) => void;
  isProcessing: string | null;
}

export function ReviewTable({ data, onDelete, isProcessing }: ReviewTableProps) {
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "delete";
  } | null>(null);

  const handleConfirm = () => {
    if (!confirmAction) return;
    onDelete(confirmAction.id);
    setConfirmAction(null);
  };

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
              <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
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
                      &quot;{review.comment}&quot;
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDateShort(review.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setConfirmAction({ id: review.id, type: "delete" })}
                      disabled={isProcessing === review.id}
                      className="w-8 h-8 text-red-600 border-red-200 hover:bg-red-50"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
        title="Hapus Ulasan"
        description="Ulasan ini akan dihapus secara permanen dari sistem."
        confirmLabel="Hapus"
        variant="danger"
        loading={isProcessing === confirmAction?.id}
        onConfirm={handleConfirm}
      />
    </>
  );
}
