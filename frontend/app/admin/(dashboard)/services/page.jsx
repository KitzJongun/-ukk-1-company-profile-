"use client";

import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ServiceForm from "@/components/admin/ServiceForm";
import SearchInput from "@/components/admin/SearchInput";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { deleteAdminResource, getAdminServices } from "@/lib/api";
import { describeError, formatDateTime, getToken, useAdminList } from "@/lib/admin";

export default function AdminServicesPage() {
  const loadServices = useCallback((token) => getAdminServices(token), []);
  const { items, loading, error, reload } = useAdminList(loadServices);

  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;

    return items.filter((service) =>
      `${service.title} ${service.short_description}`.toLowerCase().includes(term)
    );
  }, [items, query]);

  const handleSaved = async () => {
    setEditing(null);
    setToast("Layanan berhasil disimpan.");
    await reload();
  };

  const handleDelete = (service) => {
    setActionError("");
    setConfirmTarget(service);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      await deleteAdminResource(getToken(), "services", confirmTarget.id);
      setToast("Layanan berhasil dihapus.");
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
      header: "Layanan",
      render: (service) => (
        <div className="flex items-center gap-3">
          {service.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.icon}
              alt=""
              className="h-10 w-10 rounded-lg border border-slate-200 object-contain p-1"
            />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
              {service.title?.trim().charAt(0).toUpperCase() || "?"}
            </span>
          )}
          <div>
            <p className="font-medium text-slate-900">{service.title}</p>
            <p className="max-w-xs truncate text-xs text-slate-500">
              {service.short_description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "updated_at",
      header: "Diperbarui",
      render: (service) => formatDateTime(service.updated_at),
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (service) => (
        <div className="flex justify-end gap-2">
          <a
            href={`/services/${service.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Lihat
          </a>
          <button
            type="button"
            onClick={() => setEditing(service)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(service)}
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
          <h2 className="text-base font-semibold text-slate-900">Layanan</h2>
          <p className="text-sm text-slate-600">
            Daftar layanan yang tampil di halaman Home dan Services.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari layanan..." />
          <button type="button" onClick={() => setEditing("new")} className="btn-primary">
            + Tambah layanan
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
            ? "Tidak ada layanan yang cocok dengan pencarian."
            : "Belum ada layanan."
        }
      />

      <Toast message={toast} onClose={() => setToast("")} />

      <ConfirmDialog
        open={confirmTarget !== null}
        title="Hapus layanan"
        message={confirmTarget ? `Hapus layanan "${confirmTarget.title}"?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmTarget(null)}
        loading={deleting}
      />

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Tambah layanan" : "Edit layanan"}
        onClose={() => setEditing(null)}
        size="sm"
      >
        {editing !== null && (
          <ServiceForm
            initial={editing === "new" ? null : editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
