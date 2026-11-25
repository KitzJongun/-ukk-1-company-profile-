import { getSettings } from "@/lib/api";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Hubungi Nusantara Digital untuk konsultasi website, aplikasi, dan strategi konten.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const contactDetails = [
    { label: "Alamat", value: settings.address || "Jl. Merdeka No. 10, Jakarta" },
    { label: "Email", value: settings.email || "hello@nusantaradigital.id" },
    { label: "Telepon", value: settings.phone || "+62 812 3456 7890" },
    { label: "Jam kerja", value: settings.working_hours || "Senin–Jumat, 09.00–17.00 WIB" },
  ];

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Mari bicarakan kebutuhan Anda
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Isi formulir di bawah ini dan pesan Anda akan langsung masuk ke inbox
            tim kami. Kami biasanya membalas dalam 1×24 jam kerja.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-14 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Kirim pesan
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Semua kolom wajib diisi.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
            <h2 className="text-lg font-semibold">Informasi kontak</h2>
            <dl className="mt-5 space-y-4 text-sm">
              {contactDetails.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {item.label}
                  </dt>
                  <dd className="mt-0.5 text-slate-100">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>
    </>
  );
}
