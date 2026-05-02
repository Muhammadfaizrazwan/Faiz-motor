"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/motors": "Manajemen Motor",
  "/admin/motors/add": "Tambah Motor",
  "/admin/reviews": "Moderasi Ulasan",
  "/admin/users": "Manajemen User",
};

export function Topbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Find best match for page title
  const title =
    Object.entries(pageTitles)
      .filter(([path]) => pathname.startsWith(path))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ||
    (pathname.includes("/edit") ? "Edit Motor" : "Admin");

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8390E] rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#0F172A] text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 leading-none">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
