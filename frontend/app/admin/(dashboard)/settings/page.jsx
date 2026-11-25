"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings, saveAdminSettings } from "@/lib/api";
import { clearSession, describeError, getToken } from "@/lib/admin";
import Toast from "@/components/admin/Toast";

const fields = [
  { key: "site_name", label: "Nama situs", type: "text" },
  { key: "tagline", label: "Tagline", type: "textarea" },
  { key: "address", label: "Alamat", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Telepon", type: "text" },
  { key: "working_hours", label: "Jam kerja", type: "text" },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let active = true;
    getSettings(0)
      .then((settings) => {
        if (!active) return;
        const next = {};
        fields.forEach((field) => {
          next[field.key] = settings?.[field.key] ?? "";
        });
        setValues(next);
        setLoading(false);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError?.status === 401) {
          clearSession();
          router.replace("/admin/login");
          return;
        }
        setError(describeError(requestError));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await saveAdminSettings(token, values);
      setToast("Pengaturan berhasil disimpan.");
    } catch (requestError) {
      if (requestError?.status === 401) {
        clearSession();
        router.replace("/admin/login");
        return;
      }
      setError(describeError(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Memuat pengaturan...</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Pengaturan situs</h2>
        <p className="text-sm text-slate-600">
          Kelola informasi yang tampil di website publik.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="mb-1.5 block text-sm font-medium text-slate-700">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                value={values[field.key] ?? ""}
                onChange={(event) => handleChange(field.key, event.target.value)}
                disabled={saving}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
              />
            ) : (
              <input
                id={field.key}
                type={field.type}
                value={values[field.key] ?? ""}
                onChange={(event) => handleChange(field.key, event.target.value)}
                disabled={saving}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
              />
            )}
          </div>
        ))}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Menyimpan..." : "Simpan pengaturan"}
        </button>
      </form>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
