"use client";

import { useState } from "react";
import { saveAdminService } from "@/lib/api";
import { describeError, fieldError, getToken } from "@/lib/admin";
import { Field, FormActions, FormAlert, fieldInputClass } from "@/components/admin/form";

export default function ServiceForm({ initial, onSaved, onCancel }) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    short_description: initial?.short_description ?? "",
  });
  const [icon, setIcon] = useState(null);
  const [removeIcon, setRemoveIcon] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      await saveAdminService(getToken(), initial?.id, {
        ...values,
        ...(icon ? { icon } : {}),
        ...(removeIcon ? { remove_icon: true } : {}),
      });
      onSaved();
    } catch (requestError) {
      setFieldErrors(requestError?.errors ?? {});
      setError(describeError(requestError));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormAlert message={error} />

      <Field
        label="Judul layanan"
        htmlFor="service-title"
        error={fieldError(fieldErrors, "title")}
      >
        <input
          id="service-title"
          name="title"
          type="text"
          required
          maxLength={255}
          value={values.title}
          onChange={handleChange}
          disabled={submitting}
          className={fieldInputClass(fieldError(fieldErrors, "title"))}
        />
      </Field>

      <Field
        label="Deskripsi singkat"
        htmlFor="service-description"
        hint="Maksimal 255 karakter, tampil di kartu layanan."
        error={fieldError(fieldErrors, "short_description")}
      >
        <input
          id="service-description"
          name="short_description"
          type="text"
          required
          maxLength={255}
          value={values.short_description}
          onChange={handleChange}
          disabled={submitting}
          className={fieldInputClass(fieldError(fieldErrors, "short_description"))}
        />
      </Field>

      <Field
        label="Ikon (opsional)"
        htmlFor="service-icon"
        hint={initial?.icon ? "Biarkan kosong jika tidak ingin mengganti ikon." : "Maksimal 5 MB."}
        error={fieldError(fieldErrors, "icon")}
      >
        <input
          id="service-icon"
          name="icon"
          type="file"
          accept="image/*"
          onChange={(event) => setIcon(event.target.files?.[0] ?? null)}
          disabled={submitting}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
        />
        {initial?.icon && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={initial.icon}
              alt=""
              className="mt-3 h-14 w-14 rounded-lg border border-slate-200 object-contain p-1"
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={removeIcon}
                onChange={(event) => setRemoveIcon(event.target.checked)}
                disabled={submitting}
              />
              Hapus ikon saat ini
            </label>
          </>
        )}
        {icon && (
          <div className="mt-3">
            <p className="mb-1 text-xs text-slate-500">Pratinjau ikon baru:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(icon)}
              alt="Pratinjau"
              className="h-14 w-14 rounded-lg border border-slate-200 object-contain p-1"
            />
          </div>
        )}
      </Field>

      <FormActions submitting={submitting} onCancel={onCancel} />
    </form>
  );
}
