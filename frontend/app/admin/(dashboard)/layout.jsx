"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, getAdminUser, getToken } from "@/lib/admin";
import { getAdminContacts, logoutAdmin } from "@/lib/api";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", exact: true },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/portfolios", label: "Portfolios" },
  { href: "/admin/messages", label: "Pesan Kontak" },
  { href: "/admin/settings", label: "Pengaturan" },
];

function isActive(pathname, item) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function currentTitle(pathname) {
  return navItems.find((item) => isActive(pathname, item))?.label ?? "Admin";
}

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Guard sisi klien: tanpa token, kembalikan ke halaman login.
  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }

    setAdmin(getAdminUser());
    setReady(true);
  }, [router]);

  // Tutup drawer mobile setiap pindah halaman.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Ambil jumlah pesan belum dibaca untuk badge di navigasi.
  useEffect(() => {
    if (!ready) return;

    const token = getToken();
    if (!token) return;

    let active = true;

    getAdminContacts(token, { page: 1, perPage: 1, unread: true })
      .then((payload) => {
        if (active) setUnreadCount(payload?.meta?.total ?? 0);
      })
      .catch(() => {
        if (active) setUnreadCount(0);
      });

    return () => {
      active = false;
    };
  }, [ready, pathname]);

  const handleLogout = async () => {
    await logoutAdmin(getToken());
    clearSession();
    router.replace("/admin/login");
  };

  if (!ready) {
    return (
      <div className="grid flex-1 place-items-center bg-slate-100 text-sm text-slate-500">
        Memuat panel admin...
      </div>
    );
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            isActive(pathname, item)
              ? "bg-brand-600 text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span>{item.label}</span>
          {item.href === "/admin/messages" && unreadCount > 0 && (
            <span
              className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                isActive(pathname, item)
                  ? "bg-white text-brand-700"
                  : "bg-brand-500 text-white"
              }`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          ND
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Admin Panel</p>
          <p className="text-xs text-slate-400">Nusantara Digital</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">{nav}</div>

      <div className="border-t border-slate-800 p-3">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          Lihat website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 bg-slate-100">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">{sidebarContent}</aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/50"
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-xl">{sidebarContent}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md border border-slate-300 p-2 text-slate-600 lg:hidden"
              aria-label="Buka menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">{currentTitle(pathname)}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{admin?.name ?? "Admin"}</p>
              <p className="text-xs text-slate-500">{admin?.email ?? ""}</p>
            </div>
            <button type="button" onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
