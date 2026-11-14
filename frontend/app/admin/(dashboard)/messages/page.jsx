"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import { deleteContact, getAdminContacts, markContactRead } from "@/lib/api";
import { clearSession, describeError, formatDateTime, getToken } from "@/lib/admin";

const PER_PAGE = 10;

export default function AdminMessagesPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (targetPage) => {
      const token = getToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const payload = await getAdminContacts(token, {
          page: targetPage,
          perPage: PER_PAGE,
          unread: unreadOnly,
        });
        const rows = payload?.data ?? [];

        // Halaman terakhir bisa jadi kosong setelah penghapusan: mundur satu halaman.
        if (rows.length === 0 && (payload?.meta?.current_page ?? 1) > 1) {
          setPage((current) => Math.max(1, current - 1));
          return;
        }

        setItems(rows);
        setMeta(payload?.meta ?? null);
      } catch (requestError) {
        if (requestError?.status === 401) {
          clearSession();
          router.replace("/admin/login");
          return;
        }

        setError(describeError(requestError));
      } finally {
        setLoading(false);
      }
    },
    [router, unreadOnly]
  );

  useEffect(() => {
    load(page);
  }, [load, page]);

  const openMessage = async (message) => {
    setSelected(message);

    if (message.is_read) return;

    try {
      await markContactRead(getToken(), message.id);
      setItems((prev) =>
        prev.map((item) => (item.id === message.id ? { ...item, is_read: true } : item))
      );
      setSelected((current) =>
        current && current.id === message.id ? { ...current, is_read: true } : current
      );
    } catch {
      // Gagal menandai dibaca tidak boleh menghalangi admin membaca pesan.
    }
  };

  const handleDelete = async (message) => {
    if (!window.confirm(`Hapus pesan dari "${message.name}"?`)) return;

    setDeleting(true);
    setError("");

    try {
      await deleteContact(getToken(), message.id);

      if (selected?.id === message.id) setSelected(null);

      setToast("Pesan berhasil dihapus.");
      await load(page);
    } catch (requestError) {
      setError(describeError(requestError));
    } finally {
      setDeleting(false);
    }
  };

  const toggleUnread = () => {
    setPage(1);
    setUnreadOnly((value) => !value);
  };

  const lastPage = meta?.last_page ?? 1;

  const columns = [
    {
      key: "name",
      header: "Pengirim",
      render: (message) => (
        <div className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
              message.is_read ? "bg-transparent" : "bg-brand-500"
            }`}
          />
          <div>
            <p
              className={`text-slate-900 ${
                message.is_read ? "font-medium" : "font-semibold"
              }`}
            >
              {message.name}
            </p>
            <p className="text-xs text-slate-500">{message.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Pesan",
      render: (message) => (
        <p className="max-w-md truncate text-slate-600">{message.message}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (message) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            message.is_read
              ? "bg-slate-100 text-slate-600"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {message.is_read ? "Dibaca" : "Baru"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Diterima",
      render: (message) => formatDateTime(message.created_at),
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (message) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openMessage(message)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Lihat
          </button>
          <button
            type="button"
            onClick={() => handleDelete(message)}
            disabled={deleting}
            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Pesan kontak</h2>
          <p className="text-sm text-slate-600">
            Pesan yang dikirim melalui formulir kontak di website publik.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleUnread}
            aria-pressed={unreadOnly}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              unreadOnly
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Belum dibaca
          </button>
          <button
            type="button"
            onClick={() => load(page)}
            disabled={loading}
            className="btn-outline"
          >
            Muat ulang
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage={
          unreadOnly ? "Tidak ada pesan yang belum dibaca." : "Belum ada pesan masuk."
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <p>
          {meta && meta.total > 0
            ? `Menampilkan ${meta.from}–${meta.to} dari ${meta.total} pesan`
            : "Tidak ada pesan"}
        </p>

        {lastPage > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Sebelumnya
            </button>
            <span className="text-slate-500">
              Halaman {page} dari {lastPage}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(lastPage, current + 1))}
              disabled={loading || page >= lastPage}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya →
            </button>
          </div>
        )}
      </div>

      <Modal
        open={selected !== null}
        title="Detail pesan"
        onClose={() => setSelected(null)}
        size="sm"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pengirim
              </p>
              <p className="mt-1 font-medium text-slate-900">{selected.name}</p>
              <a
                href={`mailto:${selected.email}`}
                className="text-brand-700 hover:underline"
              >
                {selected.email}
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Diterima
              </p>
              <p className="mt-1 text-slate-700">{formatDateTime(selected.created_at)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pesan
              </p>
              <p className="mt-1 whitespace-pre-line leading-relaxed text-slate-700">
                {selected.message}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <a
                href={`mailto:${selected.email}`}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Balas email
              </a>
              <button
                type="button"
                onClick={() => handleDelete(selected)}
                disabled={deleting}
                className="inline-flex items-center justify-center rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                {deleting ? "Menghapus..." : "Hapus pesan"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
