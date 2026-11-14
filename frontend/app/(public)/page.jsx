import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import PortfolioCard from "@/components/PortfolioCard";
import { getLatestPortfolios, getServices } from "@/lib/api";

// Konten dikelola lewat admin: cache 60 detik lalu revalidate di background.
export const revalidate = 60;

export const metadata = {
  title: "Home",
  description:
    "Nusantara Digital membantu bisnis tumbuh melalui website, aplikasi, dan strategi konten yang tepat sasaran.",
};

const stats = [
  { value: "120+", label: "Proyek selesai" },
  { value: "45", label: "Klien aktif" },
  { value: "8", label: "Tahun pengalaman" },
];

export default async function HomePage() {
  const [services, portfolios] = await Promise.all([
    getServices(),
    getLatestPortfolios(3),
  ]);

  return (
    <>
      {/* ---------------------------- Hero statis ---------------------------- */}
      <section className="bg-gradient-to-b from-brand-900 to-brand-700 text-white">
        <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">
              Digital Partner for Growing Business
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Wujudkan kehadiran digital yang benar-benar bekerja untuk bisnis Anda.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100">
              Kami merancang website, aplikasi, dan strategi konten yang cepat,
              rapi, dan mudah dikelola — dari UMKM hingga perusahaan.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Konsultasi gratis
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Lihat portofolio
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 rounded-xl bg-white/10 p-6 backdrop-blur sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-brand-100 sm:text-sm">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------ Services ----------------------------- */}
      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Layanan kami</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Solusi end-to-end yang bisa dipilih sesuai kebutuhan dan tahap
              pertumbuhan bisnis Anda.
            </p>
          </div>
          <Link href="/services" className="btn-outline">
            Semua layanan
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Belum ada layanan yang ditampilkan. Pastikan API Laravel berjalan dan
            data layanan sudah diisi.
          </p>
        )}
      </section>

      {/* ---------------------------- Portofolio ----------------------------- */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Portofolio terbaru</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Sebagian pekerjaan yang baru kami selesaikan bersama klien.
              </p>
            </div>
            <Link href="/portfolio" className="btn-outline">
              Semua portofolio
            </Link>
          </div>

          {portfolios.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Belum ada portofolio yang dipublikasikan.
            </p>
          )}
        </div>
      </section>

      {/* -------------------------------- CTA -------------------------------- */}
      <section className="container-page py-16">
        <div className="rounded-2xl bg-brand-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Siap memulai proyek berikutnya?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-brand-100">
            Ceritakan kebutuhan Anda. Tim kami akan merespons dengan rencana dan
            estimasi yang jelas, tanpa biaya konsultasi awal.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Hubungi kami
          </Link>
        </div>
      </section>
    </>
  );
}
