"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAdminContacts,
  getAdminPages,
  getAdminPortfolios,
  getAdminServices,
} from "@/lib/api";
import { clearSession, describeError, formatDateTime, getToken } from "@/lib/admin";

const cards = [
  { key: "pages", label: "Halaman", href: "/admin/pages" },
  { key: "services", label: "Layanan", href: "/admin/services" },
  { key: "portfolios", label: "Portofolio", href: "/admin/portfolios" },
  { key: "messages", label: "Pesan masuk", href: "/admin/messages" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let active = true;

    Promise.all([
      getAdminPages(token),
      getAdminServices(token),
      getAdminPortfolios(token),
      getAdminContacts(token, { perPage: 5 }),
    ])
      .then(([pages, services, portfolios, messagesPayload]) => {
        if (!active) return;
        const messages = messagesPayload?.data ?? [];
        setData({
          pages,
          services,
          portfolios,
          messages,
          messagesTotal: messagesPayload?.meta?.total ?? messages.length,
        });
      })
      .catch((requestError) => {
        if (!active) return;

        if (requestError?.status === 401) {
          clearSession();
          router.replace("/admin/login");
          return;
        }

        setError(describeError(requestError));
      });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Ringkasan</h2>
        <p className="text-sm text-slate-600">
          Sekilas isi website dan pesan terbaru dari pengunjung.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-sm"
          >
            <p className="text-sm text-slate-600">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {data
                ? card.key === "messages"
                  ? data.messagesTotal
                  : data[card.key].length
                : "—"}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Pesan terbaru</h3>
          <Link href="/admin/messages" className="text-sm font-medium text-brand-700 hover:underline">
            Lihat semua
          </Link>
        </div>

        {!data ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Memuat...</p>
        ) : data.messages.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            Belum ada pesan masuk.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.messages.slice(0, 5).map((message) => (
              <li key={message.id} className="flex flex-wrap items-start justify-between gap-2 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{message.name}</p>
                  <p className="truncate text-xs text-slate-500">{message.message}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDateTime(message.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
