"use client";

import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import PageForm from "@/components/admin/PageForm";
import SearchInput from "@/components/admin/SearchInput";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { deleteAdminResource, getAdminPages } from "@/lib/api";
import { describeError, formatDateTime, getToken, useAdminList } from "@/lib/admin";

export default function AdminPagesPage() {
  const loadPages = useCallback((token) => getAdminPages(token), []);
  const { items, loading, error, reload } = useAdminList(loadPages);

  const [editing, setEditing] = useState(null); // null | "new" | page
  const [actionError, setActionError] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const closeForm = () => setEditing(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;

    return items.filter((page) =>
      `${page.title} ${page.slug}`.toLowerCase().includes(term)
    );
  }, [items, query]);

  const handleSaved = async () => {
    setEditing(null);
    setToast("Halaman berhasil disimpan.");
    await reload();
  };

  const handleDelete = (page) => {
    setActionError("");
    setConfirmTarget(page);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      await deleteAdminResource(getToken(), "pages", confirmTarget.id);
      setToast("Halaman berhasil dihapus.");
      setConfirmTarget(null);
      await reload();
    } catch (requestError) {
      setActionError(describeError(requestError));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (page) => (
        <div>
          <p className="font-medium text-slate-900">{page.title}</p>
          <p className="text-xs text-slate-500">/{page.slug}</p>
        </div>
      ),
    },
    {
      key: "updated_at",
      header: "Diperbarui",
      render: (page) => formatDateTime(page.updated_at),
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (page) => (
        <div className="flex justify-end gap-2">
          <a
            href={`/p/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Lihat
          </a>
          <button
            type="button"
            onClick={() => setEditing(page)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(page)}
            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
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
          <h2 className="text-base font-semibold text-slate-900">Halaman statis</h2>
          <p className="text-sm text-slate-600">
            Kelola konten halaman seperti About yang tampil di website publik.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari halaman..." />
          <button type="button" onClick={() => setEditing("new")} className="btn-primary">
            + Tambah halaman
          </button>
        </div>
      </div>

      {(error || actionError) && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || actionError}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        pageSize={10}
        emptyMessage={
          items.length > 0
            ? "Tidak ada halaman yang cocok dengan pencarian."
            : "Belum ada halaman. Tambahkan halaman pertama Anda."
        }
      />

      <Toast message={toast} onClose={() => setToast("")} />

      <ConfirmDialog
        open={confirmTarget !== null}
        title="Hapus halaman"
        message={confirmTarget ? `Hapus halaman "${confirmTarget.title}"?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
        loading={deleting}
      />

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Tambah halaman" : "Edit halaman"}
        onClose={closeForm}
      >
        {editing !== null && (
          <PageForm
            initial={editing === "new" ? null : editing}
            onSaved={handleSaved}
            onCancel={closeForm}
          />
        )}
      </Modal>
    </div>
  );
}
