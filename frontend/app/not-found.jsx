import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Kembali ke beranda
      </Link>
    </div>
  );
}
