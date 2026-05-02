"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMotors } from "@/hooks/useMotors";
import { PhotoUploader } from "./PhotoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Save } from "lucide-react";

const motorSchema = z.object({
  name: z.string().min(3, "Nama motor minimal 3 karakter"),
  brand: z.string().min(1, "Merek harus dipilih"),
  year: z.preprocess((val) => Number(val), z.number().min(1990, "Tahun tidak valid").max(new Date().getFullYear() + 1, "Tahun tidak valid")),
  color: z.string().min(2, "Warna wajib diisi"),
  condition: z.enum(["BARU", "BEKAS"], {
    message: "Kondisi harus dipilih",
  }),
  price: z.preprocess((val) => Number(val), z.number().min(100000, "Harga minimal Rp 100.000")),
  status: z.enum(["TERSEDIA", "DIPESAN", "TERJUAL"], {
    message: "Status harus dipilih",
  }),
  description: z.string().optional(),
});

type MotorFormValues = z.infer<typeof motorSchema>;

const BRANDS = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Vespa", "Lainnya"];
const STATUSES = [
  { value: "TERSEDIA", label: "Tersedia" },
  { value: "DIPESAN", label: "Dipesan" },
  { value: "TERJUAL", label: "Terjual" },
];

interface MotorFormProps {
  initialData?: any;
  motorId?: string;
}

export function MotorForm({ initialData, motorId }: MotorFormProps) {
  const router = useRouter();
  const { createMotor, updateMotor, uploadPhotos } = useMotors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  const isEditMode = !!initialData;

  const form = useForm<MotorFormValues>({
    resolver: zodResolver(motorSchema) as any,
    defaultValues: initialData || {
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      color: "",
      condition: "BARU",
      price: 0,
      status: "TERSEDIA",
      description: "",
    },
  });

  const onSubmit = async (data: MotorFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && motorId) {
        await updateMotor(motorId, data);
        // Photo uploads in edit mode are handled directly by PhotoUploader component via uploadNow()
        router.push("/admin/motors");
        router.refresh();
      } else {
        const newMotor = await createMotor(data);
        if (newPhotos.length > 0) {
          await uploadPhotos(newMotor.id, newPhotos);
        }
        router.push("/admin/motors");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="w-8 h-8 bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Edit Data Motor" : "Tambah Motor Baru"}
          </h2>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
        {/* Photo Upload Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Foto Motor</h3>
            <p className="text-xs text-slate-500 mt-1">
              {isEditMode
                ? "Kelola foto motor. Foto pertama otomatis menjadi thumbnail utama."
                : "Upload foto-foto motor. Foto pertama akan menjadi thumbnail utama."}
            </p>
          </div>

          <PhotoUploader
            motorId={motorId}
            existingPhotos={initialData?.photos || []}
            onFilesChange={setNewPhotos}
            onPhotosUpdated={() => {
              if (isEditMode) router.refresh();
            }}
          />
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Informasi Dasar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Motor <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="Mis: Honda Beat Street 2024"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Merek <span className="text-red-500">*</span></Label>
              <Select
                onValueChange={(value) => form.setValue("brand", value || "", { shouldValidate: true })}
                value={form.watch("brand") || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Merek" />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.brand && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.brand.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Tahun Keluaran <span className="text-red-500">*</span></Label>
              <Input
                id="year"
                type="number"
                {...form.register("year")}
              />
              {form.formState.errors.year && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.year.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Warna <span className="text-red-500">*</span></Label>
              <Input
                id="color"
                placeholder="Mis: Hitam Doff"
                {...form.register("color")}
              />
              {form.formState.errors.color && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.color.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* Sales Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Status & Penjualan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp) <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                type="number"
                placeholder="25000000"
                {...form.register("price")}
              />
              {form.formState.errors.price && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Penjualan <span className="text-red-500">*</span></Label>
              <Select
                onValueChange={(value: any) => form.setValue("status", value || "TERSEDIA", { shouldValidate: true })}
                value={form.watch("status") || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label>Kondisi Motor <span className="text-red-500">*</span></Label>
              <RadioGroup
                onValueChange={(value: any) => form.setValue("condition", value || "BARU", { shouldValidate: true })}
                value={form.watch("condition") || ""}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BARU" id="r1" />
                  <Label htmlFor="r1" className="cursor-pointer font-normal">Baru</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BEKAS" id="r2" />
                  <Label htmlFor="r2" className="cursor-pointer font-normal">Bekas</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100" />

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi Tambahan</Label>
          <Textarea
            id="description"
            placeholder="Tuliskan detail lengkap mengenai motor ini..."
            className="h-32 resize-y"
            {...form.register("description")}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-[#E8390E] hover:bg-[#d13009]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditMode ? "Simpan Perubahan" : "Simpan Motor Baru"}
          </Button>
        </div>
      </form>
    </div>
  );
}
