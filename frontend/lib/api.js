const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

/**
 * Helper dasar untuk memanggil REST API Laravel.
 * - Melempar Error berisi pesan dari Laravel (422/500) agar mudah ditampilkan.
 */
export async function apiFetch(path, options = {}) {
  const { method = "GET", body, token, revalidate = 60, headers = {} } = options;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    // Data konten jarang berubah: cache 60 detik. Untuk admin kirim revalidate: 0.
    next: method === "GET" ? { revalidate } : undefined,
    cache: method === "GET" ? undefined : "no-store",
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { message: text };
  }

  if (!response.ok) {
    const error = new Error(
      payload?.message || `Request gagal (${response.status})`
    );
    error.status = response.status;
    error.errors = payload?.errors || {};
    throw error;
  }

  return payload;
}

/* ----------------------------- Konten publik ----------------------------- */

export async function getServices(revalidate = 60) {
  try {
    const result = await apiFetch("/services", { revalidate });
    return result?.data ?? [];
  } catch {
    return [];
  }
}

export async function getService(slug) {
  try {
    return await apiFetch(`/services/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getPortfolios(revalidate = 60) {
  try {
    const result = await apiFetch("/portfolios", { revalidate });
    return result?.data ?? [];
  } catch {
    return [];
  }
}

/**
 * Portofolio terbaru untuk section Home. Backend sudah mengurutkan
 * `latest()`, jadi cukup ambil beberapa item pertama.
 */
export async function getLatestPortfolios(limit = 3) {
  const portfolios = await getPortfolios();
  return portfolios.slice(0, limit);
}

export async function getPortfolio(slug) {
  try {
    return await apiFetch(`/portfolios/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getPage(slug) {
  try {
    return await apiFetch(`/pages/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getPages() {
  try {
    const result = await apiFetch("/pages");
    return result?.data ?? [];
  } catch {
    return [];
  }
}

/* ------------------------------- Kontak ---------------------------------- */

export async function sendContactMessage({ name, email, message, website }) {
  return apiFetch("/contact", {
    method: "POST",
    // `website` adalah honeypot: harus kosong, diisi hanya oleh bot.
    body: { name, email, message, website },
    revalidate: 0,
  });
}

/* --------------------------------- Admin --------------------------------- */

export async function loginAdmin({ email, password }) {
  return apiFetch("/login", {
    method: "POST",
    body: { email, password },
    revalidate: 0,
  });
}

/**
 * Logout bersifat best-effort: token lokal tetap dihapus walaupun request gagal
 * (misalnya token sudah kedaluwarsa di server).
 */
export async function logoutAdmin(token) {
  try {
    return await apiFetch("/logout", { method: "POST", token, revalidate: 0 });
  } catch {
    return null;
  }
}

export async function getAdminPages(token) {
  const result = await apiFetch("/pages", { token, revalidate: 0 });
  return result?.data ?? [];
}

export async function getAdminServices(token) {
  const result = await apiFetch("/services", { token, revalidate: 0 });
  return result?.data ?? [];
}

export async function getAdminPortfolios(token) {
  const result = await apiFetch("/portfolios", { token, revalidate: 0 });
  return result?.data ?? [];
}

/**
 * Inbox terpaginasi: mengembalikan payload lengkap ({ data, meta, links }).
 */
export async function getAdminContacts(token, { page = 1, perPage = 10, unread = false } = {}) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  if (unread) query.set("unread", "1");

  return apiFetch(`/admin/contacts?${query.toString()}`, { token, revalidate: 0 });
}

export async function markContactRead(token, id) {
  return apiFetch(`/admin/contacts/${id}/read`, {
    method: "PATCH",
    token,
    revalidate: 0,
  });
}

export async function deleteContact(token, id) {
  return deleteAdminResource(token, "contacts", id);
}

/**
 * Semua create/update dikirim sebagai FormData karena bisa membawa file.
 * PHP hanya mem-parsing multipart pada POST, jadi update memakai POST +
 * `_method=PUT` (method spoofing Laravel).
 */
function buildFormData(values) {
  const form = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (key === "images") {
      Array.from(value).forEach((file, index) => {
        if (file) form.append(`images[${index}]`, file);
      });
      return;
    }

    if (key === "deleted_image_ids") {
      Array.from(value).forEach((id, index) => {
        form.append(`deleted_image_ids[${index}]`, String(id));
      });
      return;
    }

    if (typeof File !== "undefined" && value instanceof File) {
      form.append(key, value);
      return;
    }

    form.append(key, String(value));
  });

  return form;
}

function adminFormRequest(token, resource, id, values) {
  const form = buildFormData(values);
  if (id) form.append("_method", "PUT");

  return apiFetch(id ? `/admin/${resource}/${id}` : `/admin/${resource}`, {
    method: "POST",
    body: form,
    token,
    revalidate: 0,
  });
}

export async function saveAdminPage(token, id, values) {
  return adminFormRequest(token, "pages", id, values);
}

export async function saveAdminService(token, id, values) {
  return adminFormRequest(token, "services", id, values);
}

export async function saveAdminPortfolio(token, id, values) {
  return adminFormRequest(token, "portfolios", id, values);
}

export async function deleteAdminResource(token, resource, id) {
  return apiFetch(`/admin/${resource}/${id}`, {
    method: "DELETE",
    token,
    revalidate: 0,
  });
}

export { API_URL };
