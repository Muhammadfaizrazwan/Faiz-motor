import Link from "next/link";
import { Bike, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-[#E8390E] to-[#FF6B3D] rounded-xl flex items-center justify-center">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Moto<span className="text-[#E8390E]">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Marketplace motor terpercaya di Indonesia. Temukan motor impianmu
              dengan harga terbaik dan kualitas terjamin.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Navigasi
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Beranda" },
                { href: "/motors", label: "Daftar Motor" },
                { href: "/motors?condition=BARU", label: "Motor Baru" },
                { href: "/motors?condition=BEKAS", label: "Motor Bekas" },
                { href: "/saved", label: "Keranjang Saya" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Merek */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Merek Populer
            </h3>
            <ul className="space-y-3">
              {["Honda", "Yamaha", "Suzuki", "Kawasaki", "Vespa"].map(
                (brand) => (
                  <li key={brand}>
                    <Link
                      href={`/motors?brand=${brand}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {brand}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#E8390E] mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">+62 812-3456-7890</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#E8390E] mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">info@motomart.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#E8390E] mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">
                  Jl. Motor Raya No. 123, Jakarta Selatan
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} MotoMart. Hak cipta dilindungi undang-undang.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">
                Dibuat dengan ❤️ di Indonesia
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
