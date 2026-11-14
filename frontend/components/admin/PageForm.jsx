"use client";

import { useState } from "react";
import { saveAdminPage } from "@/lib/api";
import { describeError, fieldError, getToken } from "@/lib/admin";
import { Field, FormActions, FormAlert, fieldInputClass } from "@/components/admin/form";

export default function PageForm({ initial, onSaved, onCancel }) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
  });
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
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
      await saveAdminPage(getToken(), initial?.id, {
        ...values,
        ...(image ? { image } : {}),
        ...(removeImage ? { remove_image: true } : {}),
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

      <Field label="Judul" htmlFor="page-title" error={fieldError(fieldErrors, "title")}>
        <input
          id="page-title"
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
        label="Konten"
        htmlFor="page-content"
        hint="Pisahkan paragraf dengan baris baru."
        error={fieldError(fieldErrors, "content")}
      >
        <textarea
          id="page-content"
          name="content"
          rows={10}
          required
          value={values.content}
          onChange={handleChange}
          disabled={submitting}
          className={`${fieldInputClass(fieldError(fieldErrors, "content"))} resize-y`}
        />
      </Field>

      <Field
        label="Gambar (opsional)"
        htmlFor="page-image"
        hint={initial?.image ? "Biarkan kosong jika tidak ingin mengganti gambar." : "Maksimal 5 MB."}
        error={fieldError(fieldErrors, "image")}
      >
        <input
          id="page-image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          disabled={submitting}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
        />
        {initial?.image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={initial.image}
              alt={initial.title}
              className="mt-3 h-24 w-auto rounded-lg border border-slate-200 object-cover"
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={removeImage}
                onChange={(event) => setRemoveImage(event.target.checked)}
                disabled={submitting}
              />
              Hapus gambar saat ini
            </label>
          </>
        )}
      </Field>

      <FormActions submitting={submitting} onCancel={onCancel} />
    </form>
  );
}
