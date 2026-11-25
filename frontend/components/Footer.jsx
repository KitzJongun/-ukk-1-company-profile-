import Link from "next/link";
import { getSettings } from "@/lib/api";

export default async function Footer() {
  const settings = await getSettings();
  const siteName = settings.site_name || "Nusantara Digital";
  const tagline =
    settings.tagline ||
    "Mitra transformasi digital untuk UMKM dan perusahaan yang ingin tumbuh melalui website, aplikasi, dan strategi konten yang tepat sasaran.";
  const address = settings.address || "Jl. Merdeka No. 10, Jakarta";
  const email = settings.email || "hello@nusantaradigital.id";
  const phone = settings.phone || "+62 812 3456 7890";

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-slate-900">{siteName}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
            {tagline}
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
            <li>{address}</li>
            <li>{email}</li>
            <li>{phone}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
