"use client";

export default function Error({ error, reset }) {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-red-800">Terjadi kesalahan</h2>
        <p className="mt-2 text-sm text-red-700">
          {error?.message || "Halaman gagal dimuat. Silakan coba lagi."}
        </p>
        <button type="button" onClick={reset} className="btn-primary mt-5">
          Coba lagi
        </button>
      </div>
    </div>
  );
}
