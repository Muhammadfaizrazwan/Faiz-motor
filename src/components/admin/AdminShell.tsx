"use client";

import { SessionProvider } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="ml-60">
          <Topbar />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
