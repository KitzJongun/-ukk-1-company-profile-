import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/api";

export const revalidate = 60;

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    return { title: "Portofolio tidak ditemukan" };
  }

  return {
    title: portfolio.title,
    description: portfolio.short_description,
  };
}

export default async function PortfolioDetailPage({ params }) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) notFound();

  const images = portfolio.images ?? [];
  const projectDate = formatDate(portfolio.project_date);
  const paragraphs = (portfolio.full_detail ?? "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <Link
            href="/portfolio"
            className="text-sm font-medium text-brand-700 hover:underline"
          >
            ← Kembali ke portfolio
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              Portfolio
            </span>
            {projectDate && (
              <span className="text-sm text-slate-500">{projectDate}</span>
            )}
          </div>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {portfolio.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            {portfolio.short_description}
          </p>
        </div>
      </section>

      {images.length > 0 && (
        <section className="container-page pt-10">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[0].image_url}
              alt={portfolio.title}
              className="max-h-[520px] w-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">Tentang proyek</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-700">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>{portfolio.short_description}</p>
            )}
          </div>
        </article>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Butuh proyek serupa?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Ceritakan kebutuhan Anda, kami akan membantu menyusun solusi yang
            sesuai dengan target bisnis Anda.
          </p>
          <Link href="/contact" className="btn-primary mt-4 w-full">
            Hubungi kami
          </Link>
        </aside>
      </section>

      {images.length > 1 && (
        <section className="container-page pb-16">
          <h2 className="text-xl font-semibold text-slate-900">Galeri proyek</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.slice(1).map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.image_url}
                  alt={`${portfolio.title} — dokumentasi`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
