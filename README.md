# Nusantara Digital — Company Profile

Aplikasi company profile dengan backend Laravel (REST API) dan frontend Next.js.
Mencakup halaman publik (beranda, tentang, layanan, portofolio, kontak) serta
panel admin untuk mengelola konten (pages, services, portfolios) dan pesan kontak.

## Struktur

```
ukk-1/
├── backend/   # Laravel 11/12, PHP >= 8.4, Sanctum
└── frontend/  # Next.js 16 (App Router)
```

## Prasyarat

- PHP >= 8.4 (dengan ekstensi pdo_sqlite / pdo_mysql)
- Composer
- Node.js >= 20
- npm

## Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Atur koneksi database di `.env` (default SQLite). Lalu:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API tersedia di `http://127.0.0.1:8000/api`. Seeder membuat akun admin default:

- Email: `admin@example.com`
- Password: `password`

## Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
# sesuaikan NEXT_PUBLIC_API_URL bila backend tidak di 127.0.0.1:8000
npm run dev
```

Frontend tersedia di `http://localhost:3000`.

## Endpoint utama

Publik:

- `GET /api/pages/{slug}`, `GET /api/services`, `GET /api/services/{slug}`
- `GET /api/portfolios`, `GET /api/portfolios/{slug}`
- `POST /api/contact`
- `POST /api/login`

Admin (Bearer token):

- `GET/POST/PUT/DELETE /api/admin/pages`
- `GET/POST/PUT/DELETE /api/admin/services`
- `GET/POST/PUT/DELETE /api/admin/portfolios`
- `GET /api/admin/contacts`, `PATCH /api/admin/contacts/{id}/read`, `DELETE /api/admin/contacts/{id}`

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

- Gambar yang diunggah disimpan di `backend/storage/app/public` dan disajikan
  melalui symlink `backend/public/storage` (hasil `storage:link`).
- Jika upload file gagal dengan "unable to create a temporary file" (umum di
  Windows/Herd), set `upload_tmp_dir` pada `php.ini` yang dipakai (mis.
  `C:\\xampp\\tmp`) lalu restart server.
- Token admin disimpan di `localStorage` dan cookie `admin_token` agar middleware
  Next.js dapat menjaga route `/admin/*`.