"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import {
  Bike,
  Menu,
  X,
  Home,
  Search,
  Heart,
  LogIn,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/motors", label: "Motor", icon: Bike },
  { href: "/saved", label: "Tersimpan", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const savedCount = useAuthStore((s) => s.savedCount);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-slate-200/50"
            : "bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#E8390E] to-[#FF6B3D] rounded-xl flex items-center justify-center shadow-md shadow-[#E8390E]/25 group-hover:shadow-lg group-hover:shadow-[#E8390E]/30 transition-shadow">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#0A1628] tracking-tight">
                Faiz<span className="text-[#E8390E]"> Motor</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-[#E8390E] bg-[#E8390E]/8"
                        : "text-[#64748B] hover:text-[#0A1628] hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {link.href === "/saved" && savedCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E8390E] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {savedCount > 9 ? "9+" : savedCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {session?.user ? (
                <div className="flex items-center gap-3">
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 border-slate-200 hover:border-[#E8390E]/30 hover:text-[#E8390E]"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-[#0A1628] leading-tight">
                        {session.user.name}
                      </p>
                      <p className="text-[11px] text-[#64748B] leading-tight">
                        {session.user.role === "ADMIN" ? "Administrator" : "Member"}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="ml-1 p-1.5 rounded-lg text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    className="bg-[#E8390E] hover:bg-[#d13009] text-white gap-2 rounded-xl shadow-md shadow-[#E8390E]/20 hover:shadow-lg hover:shadow-[#E8390E]/30 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Masuk
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-[#0A1628] hover:bg-slate-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-2xl p-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "text-[#E8390E] bg-[#E8390E]/8"
                      : "text-[#64748B] hover:text-[#0A1628] hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                  {link.href === "/saved" && savedCount > 0 && (
                    <span className="ml-auto w-6 h-6 bg-[#E8390E] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {savedCount}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-100">
              {session?.user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0A1628]">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-[#64748B]">{session.user.email}</p>
                    </div>
                  </div>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0A1628] hover:bg-slate-50"
                    >
                      <Shield className="w-5 h-5" />
                      Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#E8390E] hover:bg-[#E8390E]/8 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Masuk / Daftar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-18" />
    </>
  );
}
