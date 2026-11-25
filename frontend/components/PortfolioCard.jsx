import Image from "next/image";
import Link from "next/link";

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

export default function PortfolioCard({ portfolio }) {
  const cover = portfolio.images?.[0]?.image_url;
  const projectDate = formatDate(portfolio.project_date);

  return (
    <Link
      href={`/portfolio/${portfolio.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {cover ? (
          <Image
            src={cover}
            alt={portfolio.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-slate-400">
            Belum ada gambar
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {projectDate && (
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {projectDate}
          </p>
        )}
        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          {portfolio.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {portfolio.short_description}
        </p>
        <span className="mt-4 text-sm font-semibold text-brand-700 group-hover:underline">
          Lihat detail →
        </span>
      </div>
    </Link>
  );
}
