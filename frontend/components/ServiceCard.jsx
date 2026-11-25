import Image from "next/image";
import Link from "next/link";

export default function ServiceCard({ service }) {
  const initial = service.title?.trim().charAt(0).toUpperCase() || "?";

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-md"
    >
      {service.icon ? (
        <Image
          src={service.icon}
          alt={service.title ? `Ikon ${service.title}` : ""}
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg object-contain"
          loading="lazy"
        />
      ) : (
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-lg font-bold text-brand-700">
          {initial}
        </span>
      )}

      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {service.short_description}
      </p>
      <span className="mt-4 text-sm font-semibold text-brand-700 group-hover:underline">
        Lihat detail →
      </span>
    </Link>
  );
}
