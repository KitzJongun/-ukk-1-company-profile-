import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-slate-900">Nusantara Digital</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
            Mitra transformasi digital untuk UMKM dan perusahaan yang ingin tumbuh
            melalui website, aplikasi, dan strategi konten yang tepat sasaran.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Navigasi
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/services" className="hover:text-brand-700">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-brand-700">Portfolio</Link></li>
            <li><Link href="/contact" className="hover:text-brand-700">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Kontak
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Jl. Merdeka No. 10, Jakarta</li>
            <li>hello@nusantaradigital.id</li>
            <li>+62 812 3456 7890</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Nusantara Digital. All rights reserved.
      </div>
    </footer>
  );
}
