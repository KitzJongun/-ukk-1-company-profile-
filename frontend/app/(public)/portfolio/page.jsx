import PortfolioCard from "@/components/PortfolioCard";
import { getPortfolios } from "@/lib/api";

export const revalidate = 60;

export const metadata = {
  title: "Portfolio",
  description:
    "Kumpulan proyek website dan aplikasi yang telah dikerjakan Nusantara Digital.",
};

export default async function PortfolioPage() {
  const portfolios = await getPortfolios();

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Portfolio
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Proyek yang kami kerjakan
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Setiap proyek dimulai dari masalah nyata klien. Berikut sebagian
            hasil yang sudah kami serahkan.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        {portfolios.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Belum ada portofolio yang dipublikasikan.
          </p>
        )}
      </section>
    </>
  );
}
