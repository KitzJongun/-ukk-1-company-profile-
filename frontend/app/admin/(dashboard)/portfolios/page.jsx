"use client";

import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import PortfolioForm from "@/components/admin/PortfolioForm";
import SearchInput from "@/components/admin/SearchInput";
import Toast from "@/components/admin/Toast";
import { deleteAdminResource, getAdminPortfolios } from "@/lib/api";
import { describeError, formatDateTime, getToken, useAdminList } from "@/lib/admin";

export default function AdminPortfoliosPage() {
  const loadPortfolios = useCallback((token) => getAdminPortfolios(token), []);
  const { items, loading, error, reload } = useAdminList(loadPortfolios);

  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;

    return items.filter((portfolio) =>
      `${portfolio.title} ${portfolio.short_description}`.toLowerCase().includes(term)
    );
  }, [items, query]);

  const handleSaved = async () => {
    setEditing(null);
    setToast("Portofolio berhasil disimpan.");
    await reload();
  };

  const handleDelete = async (portfolio) => {
    if (
      !window.confirm(
        `Hapus portofolio "${portfolio.title}" beserta semua gambarnya?`
      )
    ) {
      return;
    }

    setActionError("");
    try {
      await deleteAdminResource(getToken(), "portfolios", portfolio.id);
      setToast("Portofolio berhasil dihapus.");
      await reload();
    } catch (requestError) {
      setActionError(describeError(requestError));
    }
  };

  const columns = [
    {
      key: "title",
      header: "Proyek",
      render: (portfolio) => (
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-xs text-slate-400">
            {portfolio.images?.[0]?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portfolio.images[0].image_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              "—"
            )}
          </span>
          <div>
            <p className="font-medium text-slate-900">{portfolio.title}</p>
            <p className="max-w-xs truncate text-xs text-slate-500">
              {portfolio.short_description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "project_date",
      header: "Tanggal proyek",
      render: (portfolio) => portfolio.project_date ?? "-",
    },
    {
      key: "images",
      header: "Gambar",
      render: (portfolio) => portfolio.images?.length ?? 0,
    },
    {
      key: "updated_at",
      header: "Diperbarui",
      render: (portfolio) => formatDateTime(portfolio.updated_at),
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (portfolio) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(portfolio)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(portfolio)}
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
          <h2 className="text-base font-semibold text-slate-900">Portofolio</h2>
          <p className="text-sm text-slate-600">
            Proyek yang ditampilkan di halaman Portfolio dan Home.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <SearchInput value={query} onChange={setQuery} placeholder="Cari portofolio..." />
          <button type="button" onClick={() => setEditing("new")} className="btn-primary">
            + Tambah portofolio
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
        emptyMessage={
          items.length > 0
            ? "Tidak ada portofolio yang cocok dengan pencarian."
            : "Belum ada portofolio."
        }
      />

      <Toast message={toast} onClose={() => setToast("")} />

      <Modal
        open={editing !== null}
        title={editing === "new" ? "Tambah portofolio" : "Edit portofolio"}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <PortfolioForm
            initial={editing === "new" ? null : editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
