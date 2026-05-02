"use client";

import { SessionProvider } from "next-auth/react";

export function UserProviders({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
