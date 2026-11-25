import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices } from "@/lib/api";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return { title: "Layanan tidak ditemukan" };
  }

  return {
    title: service.title,
    description: service.short_description,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const [service, services] = await Promise.all([getService(slug), getServices()]);

  if (!service) notFound();

  const others = services.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <Link
            href="/services"
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            ← Kembali ke layanan
          </Link>

          <div className="mt-5 flex items-start gap-4">
            {service.icon ? (
              <Image
                src={service.icon}
                alt={service.title ? `Ikon ${service.title}` : ""}
                width={64}
                height={64}
                className="h-16 w-16 rounded-xl border border-slate-200 object-contain p-2"
                loading="lazy"
              />
            ) : (
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl font-bold text-brand-700">
                {service.title?.trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
                Layanan
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {service.title}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600">
            {service.short_description}
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">
            Yang Anda dapatkan
          </h2>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-700">
            {[
              `Pengerjaan ${service.title} yang disesuaikan dengan kebutuhan bisnis Anda.`,
              "Diskusi kebutuhan dan estimasi waktu sebelum pekerjaan dimulai.",
              "Penyerahan hasil beserta panduan penggunaan untuk tim Anda.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Tertarik dengan layanan ini?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sampaikan kebutuhan Anda lewat formulir kontak. Kami akan merespons
            dengan langkah berikutnya.
          </p>
          <Link href="/contact" className="btn-primary mt-4 w-full">
            Diskusikan kebutuhan
          </Link>
        </aside>
      </section>

      {others.length > 0 && (
        <section className="container-page pb-16">
          <h2 className="text-xl font-semibold text-slate-900">Layanan lainnya</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.id}
                href={`/services/${item.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-sm"
              >
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {item.short_description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
