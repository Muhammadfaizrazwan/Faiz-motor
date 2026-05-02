import { Navbar } from "@/components/user/Navbar";
import { Footer } from "@/components/user/Footer";
import { UserProviders } from "@/components/user/Providers";

export const metadata = {
  title: {
    default: "Faiz Motor — Marketplace Motor Terpercaya",
    template: "%s | Faiz Motor",
  },
  description:
    "Temukan motor impianmu di Faiz Motor. Marketplace motor baru dan bekas terpercaya dengan harga terbaik.",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProviders>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </UserProviders>
  );
}
