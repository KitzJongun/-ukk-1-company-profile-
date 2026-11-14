"use client";

import { useState } from "react";
import { saveAdminPortfolio } from "@/lib/api";
import { describeError, fieldError, getToken } from "@/lib/admin";
import { Field, FormActions, FormAlert, fieldInputClass } from "@/components/admin/form";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function PortfolioForm({ initial, onSaved, onCancel }) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    short_description: initial?.short_description ?? "",
    full_detail: initial?.full_detail ?? "",
    project_date: initial?.project_date ?? today(),
  });
  const [images, setImages] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const existingImages = initial?.images ?? [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDelete = (id) => {
    setDeletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      await saveAdminPortfolio(getToken(), initial?.id, {
        ...values,
        images,
        deleted_image_ids: deletedIds,
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

      <Field label="Judul proyek" htmlFor="portfolio-title" error={fieldError(fieldErrors, "title")}>
        <input
          id="portfolio-title"
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
        htmlFor="portfolio-short"
        hint="Maksimal 255 karakter, tampil di kartu."
        error={fieldError(fieldErrors, "short_description")}
      >
        <input
          id="portfolio-short"
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
        label="Detail lengkap"
        htmlFor="portfolio-detail"
        error={fieldError(fieldErrors, "full_detail")}
      >
        <textarea
          id="portfolio-detail"
          name="full_detail"
          rows={6}
          required
          value={values.full_detail}
          onChange={handleChange}
          disabled={submitting}
          className={`${fieldInputClass(fieldError(fieldErrors, "full_detail"))} resize-y`}
        />
      </Field>

      <Field
        label="Tanggal proyek"
        htmlFor="portfolio-date"
        error={fieldError(fieldErrors, "project_date")}
      >
        <input
          id="portfolio-date"
          name="project_date"
          type="date"
          required
          value={values.project_date}
          onChange={handleChange}
          disabled={submitting}
          className={fieldInputClass(fieldError(fieldErrors, "project_date"))}
        />
      </Field>

      {existingImages.length > 0 && (
        <Field label="Gambar saat ini">
          <p className="mb-2 text-xs text-slate-500">
            Centang gambar yang ingin dihapus saat menyimpan.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {existingImages.map((image) => {
              const marked = deletedIds.includes(image.id);

              return (
                <label
                  key={image.id}
                  className={`cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                    marked ? "border-red-400 opacity-60" : "border-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={marked}
                      onChange={() => toggleDelete(image.id)}
                      disabled={submitting}
                      className="h-3.5 w-3.5 rounded border-slate-300"
                    />
                    Hapus
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.image_url}
                    alt=""
                    className="h-24 w-full object-cover"
                  />
                </label>
              );
            })}
          </div>
        </Field>
      )}

      <Field
        label="Tambah gambar"
        htmlFor="portfolio-images"
        hint="Bisa pilih beberapa file sekaligus. Maksimal 5 MB per file."
        error={fieldError(fieldErrors, "images")}
      >
        <input
          id="portfolio-images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => setImages(Array.from(event.target.files ?? []))}
          disabled={submitting}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700"
        />
        {images.length > 0 && (
          <p className="mt-1 text-xs text-slate-500">{images.length} file dipilih.</p>
        )}
      </Field>

      <FormActions submitting={submitting} onCancel={onCancel} />
    </form>
  );
}
