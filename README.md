# Nusantara Digital — Company Profile

Aplikasi company profile dengan **backend Laravel (REST API)** dan **frontend Next.js**.
Mencakup halaman publik dan panel admin untuk mengelola konten, pesan kontak, serta pengaturan situs.

## Ringkasan

| Bagian | Teknologi |
|---|---|
| Backend | Laravel, PHP >= 8.4, Sanctum |
| Frontend | Next.js 16 (App Router), Tailwind CSS |
| Database | MySQL (`ukk_company_profile`) |
| Fitur admin | CRUD Pages, Services, Portfolios, Inbox Kontak, Pengaturan Situs |

## Desain UI/UX (Figma)

Desain antarmuka dirancang terlebih dahulu menggunakan Figma:

**[https://www.figma.com/site/MBaCWPtJR6EsUKdQSC8Xqp/Untitled?node-id=0-6&t=3EpDayXJWuVeIcHr-1]**

## Struktur Proyek

```text
ukk-1/x
├── backend/    # Laravel REST API
└── frontend/   # Next.js App Router
```

## Prasyarat

- PHP >= 8.4 dengan ekstensi `pdo_mysql`
- Composer
- Node.js >= 20
- npm

## Menjalankan Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Atur koneksi database di `.env`, lalu:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API tersedia di `http://127.0.0.1:8000/api`.

Akun admin default:

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `password` |

## Menjalankan Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend tersedia di `http://localhost:3000`.

## Fitur

### Publik
- Beranda
- Tentang
- Layanan
- Portofolio
- Kontak
- SEO metadata, sitemap, dan robots.txt
- Informasi kontak dinamis dari pengaturan situs

### Admin
- Login dengan Laravel Sanctum
- Dashboard ringkasan
- CRUD halaman statis
- CRUD layanan dengan upload ikon
- CRUD portofolio dengan upload gambar
- Inbox pesan kontak dengan paginasi
- Pengaturan situs

## Endpoint Utama

### Publik
- `GET /api/pages/{slug}`
- `GET /api/services`
- `GET /api/services/{slug}`
- `GET /api/portfolios`
- `GET /api/portfolios/{slug}`
- `GET /api/settings`
- `POST /api/contact`
- `POST /api/login`

### Admin (Bearer Token)
- `GET/POST/PUT/DELETE /api/admin/pages`
- `GET/POST/PUT/DELETE /api/admin/services`
- `GET/POST/PUT/DELETE /api/admin/portfolios`
- `GET /api/admin/contacts`
- `PATCH /api/admin/contacts/{id}/read`
- `DELETE /api/admin/contacts/{id}`
- `PUT /api/admin/settings`

## Pengujian

Backend:

```bash
cd backend
./vendor/bin/phpunit
```

Frontend:

```bash
cd frontend
npm run build
```

## Catatan

- Gambar yang diunggah disimpan di `backend/storage/app/public` dan disajikan melalui symlink `backend/public/storage`.
- Jika upload file gagal dengan “unable to create a temporary file” di Windows/Herd, set `upload_tmp_dir` pada `php.ini`, lalu restart server.
- Token admin disimpan di `localStorage` dan cookie `admin_token` agar middleware Next.js dapat menjaga route `/admin/*`.
- Frontend mengonsumsi pengaturan situs dari `/api/settings`; admin dapat mengubahnya melalui menu **Pengaturan**.
