import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/api";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return { title: "Halaman tidak ditemukan" };
  }

  return {
    title: page.title,
    description: page.content?.slice(0, 160),
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  const paragraphs = (page.content ?? "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Halaman
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {page.title}
          </h1>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          {page.image && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.image}
                alt={page.title}
                className="max-h-[420px] w-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4 text-base leading-relaxed text-slate-700">
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">Butuh bantuan?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Tim kami siap membantu menjawab pertanyaan Anda.
          </p>
          <Link href="/contact" className="btn-primary mt-4 w-full">
            Hubungi kami
          </Link>
        </aside>
      </section>
    </>
  );
}
