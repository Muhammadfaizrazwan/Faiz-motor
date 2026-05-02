"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bike, Loader2, Mail, Lock, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (name.length < 2) newErrors.name = "Nama minimal 2 karakter";
    if (!email.includes("@")) newErrors.email = "Email tidak valid";
    if (password.length < 6) newErrors.password = "Password minimal 6 karakter";
    if (password !== confirmPassword) newErrors.confirmPassword = "Password tidak cocok";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password, phone: phone || null });
      toast.success("Registrasi berhasil! Sedang login...");

      // Auto-login after registration
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrors({ email: "Email sudah terdaftar" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#E8390E] to-[#FF6B3D] rounded-xl flex items-center justify-center shadow-lg shadow-[#E8390E]/30">
            <Bike className="w-7 h-7 text-white" />
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-[#0A1628]">
          Daftar Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-[#64748B]">
          Buat akun untuk mulai menyimpan motor favorit
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input id="name" name="name" required placeholder="Nama lengkap Anda" className="h-11 pl-10" />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input id="email" name="email" type="email" required placeholder="nama@email.com" className="h-11 pl-10" />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">No. HP <span className="text-[#64748B] text-xs">(opsional)</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input id="phone" name="phone" type="tel" placeholder="081234567890" className="h-11 pl-10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input id="password" name="password" type="password" required placeholder="Minimal 6 karakter" className="h-11 pl-10" />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Konfirmasi Password <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Ulangi password" className="h-11 pl-10" />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#E8390E] hover:bg-[#d13009] text-base font-semibold shadow-md shadow-[#E8390E]/20 rounded-xl mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748B]">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-[#E8390E] hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
