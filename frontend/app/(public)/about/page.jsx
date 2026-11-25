import Image from "next/image";
import { getPage } from "@/lib/api";

export const revalidate = 60;

export const metadata = {
  title: "About",
  description:
    "Kenali Nusantara Digital: tim yang membantu bisnis tumbuh melalui produk digital yang rapi dan terukur.",
};

// Dipakai bila halaman slug "about" belum diisi lewat panel admin.
const fallbackContent = {
  title: "Tentang Nusantara Digital",
  content:
    "Nusantara Digital adalah studio produk digital yang berfokus pada website dan aplikasi untuk bisnis yang sedang bertumbuh.\n\nKami percaya pekerjaan yang baik lahir dari pemahaman bisnis yang jelas, eksekusi yang rapi, dan komunikasi yang terbuka. Karena itu setiap proyek dimulai dengan diskusi kebutuhan, lalu dikerjakan secara bertahap agar hasilnya bisa langsung dipakai.\n\nSejak 2018 kami telah mendampingi puluhan UMKM dan perusahaan dalam membangun kehadiran digital yang konsisten.",
  image: null,
};

const values = [
  {
    title: "Transparan",
    description:
      "Estimasi waktu dan biaya disepakati di awal, tanpa biaya tersembunyi di tengah proyek.",
  },
  {
    title: "Terukur",
    description:
      "Setiap pekerjaan diarahkan pada tujuan bisnis yang jelas dan bisa dievaluasi.",
  },
  {
    title: "Berkelanjutan",
    description:
      "Kode dan konten diserahkan dengan dokumentasi, sehingga tim Anda bisa mengelolanya sendiri.",
  },
];

export default async function AboutPage() {
  const page = (await getPage("about")) ?? fallbackContent;

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            About us
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {page.title}
          </h1>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4 text-base leading-relaxed text-slate-700">
            {page.content
              .split(/\n{1,}/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <h2 className="text-base font-semibold text-slate-900">
                  {value.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          {page.image && (
            <Image
              src={page.image}
              alt={page.title}
              width={800}
              height={600}
              className="h-auto w-full rounded-xl object-cover"
              loading="lazy"
            />
          )}

          <div className="rounded-xl bg-slate-900 p-6 text-white">
            <h2 className="text-lg font-semibold">Tertarik bekerja sama?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Kami terbuka untuk proyek baru maupun pendampingan jangka panjang.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
