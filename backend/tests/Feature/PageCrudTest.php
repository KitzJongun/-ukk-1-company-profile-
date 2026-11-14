<?php

namespace Tests\Feature;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PageCrudTest extends TestCase
{
    use RefreshDatabase;

    private Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Admin::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => 'rahasia123',
        ]);

        Sanctum::actingAs($this->admin);
    }

    public function test_admin_bisa_membuat_halaman_dengan_slug_otomatis(): void
    {
        $response = $this->postJson('/api/admin/pages', [
            'title' => 'Tentang Kami',
            'content' => 'Isi halaman tentang kami.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.title', 'Tentang Kami')
            ->assertJsonPath('data.slug', 'tentang-kami');

        $this->assertDatabaseHas('pages', [
            'id' => $response->json('data.id'),
            'slug' => 'tentang-kami',
        ]);
    }

    public function test_admin_bisa_mengubah_halaman(): void
    {
        $page = $this->postJson('/api/admin/pages', [
            'title' => 'Tentang Kami',
            'content' => 'Isi lama.',
        ])->json('data');

        $this->putJson("/api/admin/pages/{$page['id']}", [
            'title' => 'Profil Perusahaan',
            'content' => 'Isi baru.',
        ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'profil-perusahaan');

        $this->assertDatabaseHas('pages', [
            'id' => $page['id'],
            'title' => 'Profil Perusahaan',
            'content' => 'Isi baru.',
        ]);
    }

    public function test_admin_bisa_menghapus_halaman(): void
    {
        $page = $this->postJson('/api/admin/pages', [
            'title' => 'Halaman Sementara',
            'content' => 'Akan dihapus.',
        ])->json('data');

        $this->deleteJson("/api/admin/pages/{$page['id']}")->assertOk();

        $this->assertDatabaseMissing('pages', ['id' => $page['id']]);
    }

    public function test_halaman_wajib_punya_judul_dan_konten(): void
    {
        $this->postJson('/api/admin/pages', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content']);
    }
}
