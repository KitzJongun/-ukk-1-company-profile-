import "./globals.css";

export const metadata = {
  title: {
    default: "Nusantara Digital — Company Profile",
    template: "%s | Nusantara Digital",
  },
  description:
    "Website company profile dinamis: layanan, portofolio, dan informasi perusahaan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
