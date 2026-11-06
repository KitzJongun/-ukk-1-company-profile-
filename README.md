# UKK-1 - Website Company Profile Dinamis

Aplikasi Website Company Profile dinamis yang dibuat untuk memenuhi Soal Praktik Kejuruan (SPK) RPL-02.
Aplikasi ini mengimplementasikan desain dari Figma ke dalam kode React JS (Vite) dan terhubung dengan API Laravel.

## 🎨 Desain UI/UX (Figma)
Sebelum melakukan pengodean, desain antarmuka dirancang terlebih dahulu menggunakan Figma:
**[https://www.figma.com/design/5aTc9l3ify5RIkHBwHgit9/Untitled?node-id=0-1&t=0UJVWcPxjQ7xgRDK-1]**

## 🛠️ Teknologi yang Digunakan
- **Backend:** Laravel (RESTful API + Laravel Sanctum)
- **Frontend:** React JS (Vite) + Tailwind CSS + Axios
- **Database:** MySQL (`ukk_company_profile`)

## ✨ Fitur yang Telah Diselesaikan
1. **Halaman Publik (Guest):** Home, About Us, Services, Portfolio, Contact Us.
2. **Halaman Admin:** 
   - Login Admin (Sanctum).
   - Dashboard dengan Sidebar modern.
   - CRUD Layanan (Upload Gambar).
   - CRUD Halaman.
   - Lihat Pesan Masuk dari form kontak.
3. **Desain Responsif:** Menggunakan framework Tailwind CSS.

## 🚀 Cara Menjalankan Aplikasi
### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
# (Sesuaikan DB_DATABASE=ukk_company_profile di .env)
php artisan key:generate
php artisan migrate --seed
php artisan serve
