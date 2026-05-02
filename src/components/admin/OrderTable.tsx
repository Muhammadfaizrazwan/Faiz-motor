"use client";

import { useState } from "react";
import { formatRupiah, formatDateShort } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SavedMotor {
  motorId: string;
  userId: string;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string | null };
  motor: { id: string; name: string; brand: string; price: number; status: string };
}

interface OrderTableProps {
  data: SavedMotor[];
  onUpdateStatus: (motorId: string, newStatus: "TERSEDIA" | "DIPESAN" | "TERJUAL") => void;
  isProcessing: string | null;
}

export function OrderTable({ data, onUpdateStatus, isProcessing }: OrderTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 border-b border-slate-100">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">Pelanggan</TableHead>
            <TableHead className="font-semibold text-slate-700">Motor Disimpan</TableHead>
            <TableHead className="font-semibold text-slate-700">Harga</TableHead>
            <TableHead className="font-semibold text-slate-700">Tanggal Disimpan</TableHead>
            <TableHead className="text-right font-semibold text-slate-700">Update Status Motor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                Tidak ada data pesanan/keranjang
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={`${item.userId}-${item.motorId}`} className="hover:bg-slate-50/50">
                <TableCell>
                  <p className="font-medium text-slate-800">{item.user.name}</p>
                  <p className="text-xs text-slate-500">{item.user.email}</p>
                  {item.user.phone && <p className="text-xs text-slate-500">{item.user.phone}</p>}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-slate-800">{item.motor.name}</p>
                  <p className="text-xs text-slate-500">{item.motor.brand}</p>
                </TableCell>
                <TableCell className="font-medium text-slate-800">
                  {formatRupiah(item.motor.price)}
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {formatDateShort(item.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <StatusBadge status={item.motor.status} type="motor" />
                    <Select
                      value={item.motor.status}
                      onValueChange={(val: any) => onUpdateStatus(item.motor.id, val)}
                      disabled={isProcessing === item.motor.id}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue placeholder="Ubah Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TERSEDIA">Tersedia</SelectItem>
                        <SelectItem value="DIPESAN">Dipesan</SelectItem>
                        <SelectItem value="TERJUAL">Terjual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
