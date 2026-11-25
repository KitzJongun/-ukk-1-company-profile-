"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/lib/api";
import { getToken, setSession, describeError } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sudah punya token? langsung masuk dashboard.
  useEffect(() => {
    if (getToken()) router.replace("/admin/dashboard");
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await loginAdmin(form);
      setSession({ token: result.token, admin: result.admin });
      router.replace("/admin/dashboard");
    } catch (requestError) {
      setError(describeError(requestError));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            ND
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-600">
            Masuk untuk mengelola konten website.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              enterKeyHint="next"
              autoFocus
              required
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              enterKeyHint="done"
              required
              value={form.password}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="text-brand-700 hover:underline">
            ← Kembali ke website
          </Link>
        </p>
      </div>
    </div>
  );
}
