import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nusantara Digital — Company Profile",
    template: "%s | Nusantara Digital",
  },
  description:
    "Website company profile dinamis: layanan, portofolio, dan informasi perusahaan.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Nusantara Digital",
    title: "Nusantara Digital — Company Profile",
    description:
      "Website company profile dinamis: layanan, portofolio, dan informasi perusahaan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nusantara Digital — Company Profile",
    description:
      "Website company profile dinamis: layanan, portofolio, dan informasi perusahaan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-700 focus:shadow"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
