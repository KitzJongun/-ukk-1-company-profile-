export const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50";

export const inputErrorClass = "border-red-400 focus:border-red-500 focus:ring-red-100";

export function fieldInputClass(error) {
  return error ? `${inputClass} ${inputErrorClass}` : inputClass;
}

export function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

export function FormAlert({ message }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </p>
  );
}

export function FormActions({ submitting, onCancel, label = "Simpan" }) {
  return (
    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        Batal
      </button>
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Menyimpan..." : label}
      </button>
    </div>
  );
}
