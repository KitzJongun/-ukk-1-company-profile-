"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";

/* ----------------------------- Sesi admin ------------------------------ */

export function getToken() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const TOKEN_COOKIE = "admin_token";

/**
 * Token disimpan dua kali: localStorage untuk request API dan cookie agar
 * `middleware.js` bisa mengarahkan pengunjung sebelum halaman dirender.
 * Cookie ini bukan httpOnly (dibuat dari klien); sesi tetap dijaga oleh
 * guard Sanctum di backend.
 */
export function setSession({ token, admin }) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(admin ?? null));
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=86400; samesite=lax`;
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function fieldError(errors, key) {
  return errors?.[key]?.[0] ?? "";
}

/**
 * Pesan error siap tampil: utamakan pesan validasi per-field bila ada.
 */
export function describeError(error) {
  const fieldErrors = Object.values(error?.errors ?? {}).flat();
  if (fieldErrors.length > 0) return fieldErrors[0];

  return error?.message || "Terjadi kesalahan. Silakan coba lagi.";
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

/* --------------------------- Hook data list ---------------------------- */

/**
 * Memuat daftar data admin. `fetcher` harus stabil (bungkus dengan
 * useCallback di komponen) dan menerima token sebagai argumen.
 * Token 401 otomatis menghapus sesi dan kembali ke halaman login.
 */
export function useAdminList(fetcher) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setItems(await fetcher(token));
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
  }, [fetcher, router]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload };
}
