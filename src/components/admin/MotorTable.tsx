"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
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
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";

interface Motor {
  id: string;
  name: string;
  brand: string;
  year: number;
  condition: string;
  price: number;
  status: string;
  photos: { url: string; isPrimary: boolean }[];
}

interface MotorTableProps {
  data: Motor[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function MotorTable({ data, onDelete, isDeleting }: MotorTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-100">
            <TableRow>
              <TableHead className="w-16 text-center">Foto</TableHead>
              <TableHead className="font-semibold text-slate-700">Nama Motor</TableHead>
              <TableHead className="font-semibold text-slate-700">Tahun</TableHead>
              <TableHead className="font-semibold text-slate-700">Harga</TableHead>
              <TableHead className="font-semibold text-slate-700">Kondisi</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  Belum ada data motor
                </TableCell>
              </TableRow>
            ) : (
              data.map((motor) => {
                const primaryPhoto =
                  motor.photos.find((p) => p.isPrimary) || motor.photos[0];

                return (
                  <TableRow key={motor.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      {primaryPhoto ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                          <Image
                            src={primaryPhoto.url}
                            alt={motor.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-800">{motor.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{motor.brand}</p>
                    </TableCell>
                    <TableCell className="text-slate-600">{motor.year}</TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {formatRupiah(motor.price)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={motor.condition} type="motor" />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={motor.status} type="motor" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/motors/${motor.id}/edit`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setDeleteId(motor.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Hapus Motor"
        description="Apakah Anda yakin ingin menghapus motor ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait (foto, ulasan) akan ikut terhapus."
        confirmLabel="Hapus"
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
