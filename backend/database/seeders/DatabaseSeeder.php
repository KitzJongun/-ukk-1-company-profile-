<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Page;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        $this->call(AdminSeeder::class);

        // Halaman statis dummy.
        Page::updateOrCreate(
            ['slug' => 'about-us'],
            [
                'title' => 'Tentang Kami',
                'content' => "Nusantara Digital adalah studio digital yang membantu UMKM dan perusahaan membangun website, aplikasi, dan strategi konten.\n\nKami fokus pada solusi yang cepat, modern, dan mudah dikelola.",
                'image' => null,
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Beranda',
                'content' => 'Selamat datang di Nusantara Digital.',
                'image' => null,
            ]
        );

        // Layanan dummy.
        $services = [
            ['title' => 'Pembuatan Website', 'short_description' => 'Website company profile, landing page, dan e-commerce.'],
            ['title' => 'Aplikasi Web', 'short_description' => 'Aplikasi berbasis web yang disesuaikan kebutuhan bisnis.'],
            ['title' => 'Desain UI/UX', 'short_description' => 'Desain antarmuka modern dan pengalaman pengguna optimal.'],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($service['title'])],
                [
                    'title' => $service['title'],
                    'short_description' => $service['short_description'],
                    'icon' => null,
                ]
            );
        }

        // Portofolio dummy.
        $portfolio = Portfolio::updateOrCreate(
            ['slug' => 'website-company-profile-klien-a'],
            [
                'title' => 'Website Company Profile Klien A',
                'short_description' => 'Redesain website company profile dengan CMS custom.',
                'full_detail' => 'Proyek redesain website company profile yang meningkatkan kecepatan dan konversi.',
                'project_date' => '2025-06-15',
            ]
        );

        // Pengaturan situs (opsional).
        $settings = [
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'email' => 'hello@nusantaradigital.id',
            'phone' => '+62 812 3456 7890',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
