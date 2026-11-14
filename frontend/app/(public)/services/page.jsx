import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/lib/api";

export const revalidate = 60;

export const metadata = {
  title: "Services",
  description:
    "Daftar layanan Nusantara Digital: pengembangan website, aplikasi, desain, dan strategi konten.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Services
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Layanan yang kami kerjakan
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Mulai dari pembuatan website company profile hingga aplikasi internal
            yang membantu operasional harian.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        {services.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Belum ada layanan yang dipublikasikan.
          </p>
        )}

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Butuh layanan yang belum tercantum?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Sampaikan kebutuhan Anda lewat formulir kontak, kami akan menilai
            apakah bisa dikerjakan atau perlu disesuaikan.
          </p>
          <Link href="/contact" className="btn-primary mt-5">
            Diskusikan kebutuhan
          </Link>
        </div>
      </section>
    </>
  );
}
