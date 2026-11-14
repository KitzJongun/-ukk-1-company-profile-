<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_pengunjung_bisa_mengirim_pesan(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'message' => 'Saya ingin bertanya soal layanan.',
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Budi')
            ->assertJsonPath('data.is_read', false);

        $this->assertDatabaseHas('contacts', [
            'email' => 'budi@example.com',
            'is_read' => false,
        ]);
    }

    public function test_pesan_kontak_divalidasi(): void
    {
        $this->postJson('/api/contact', ['email' => 'bukan-email'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'message']);
    }

    public function test_honeypot_menolak_pesan_bot(): void
    {
        $this->postJson('/api/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Spam',
            'website' => 'https://spam.example.com',
        ])->assertStatus(422);

        $this->assertDatabaseCount('contacts', 0);
    }

    private function actingAsAdmin(): void
    {
        $admin = Admin::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => 'rahasia123',
        ]);

        Sanctum::actingAs($admin);
    }

    public function test_admin_melihat_pesan_terpaginasi(): void
    {
        $this->actingAsAdmin();

        Contact::create(['name' => 'A', 'email' => 'a@example.com', 'message' => 'Satu']);
        Contact::create(['name' => 'B', 'email' => 'b@example.com', 'message' => 'Dua']);
        Contact::create(['name' => 'C', 'email' => 'c@example.com', 'message' => 'Tiga']);

        $this->getJson('/api/admin/contacts?per_page=2')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3);

        $this->getJson('/api/admin/contacts?unread=1&per_page=5')
            ->assertOk()
            ->assertJsonPath('meta.total', 3);
    }

    public function test_admin_bisa_menandai_pesan_dibaca_dan_menghapusnya(): void
    {
        $this->actingAsAdmin();

        $contact = Contact::create([
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'message' => 'Halo',
        ]);

        $this->patchJson("/api/admin/contacts/{$contact->id}/read")
            ->assertOk()
            ->assertJsonPath('data.is_read', true);

        $this->assertDatabaseHas('contacts', ['id' => $contact->id, 'is_read' => true]);

        $this->deleteJson("/api/admin/contacts/{$contact->id}")->assertOk();
        $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);
    }
}
