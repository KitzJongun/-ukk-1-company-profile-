<?php

namespace Tests\Feature;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): Admin
    {
        return Admin::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => 'rahasia123',
        ]);
    }

    public function test_admin_bisa_login_dengan_kredensial_benar(): void
    {
        $this->admin();

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'rahasia123',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'message',
                'token',
                'admin' => ['id', 'name', 'email'],
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->assertArrayNotHasKey('password', $response->json('admin'));
    }

    public function test_login_gagal_dengan_password_salah(): void
    {
        $this->admin();

        $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'salah',
        ])
            ->assertStatus(401)
            ->assertJsonPath('message', 'Email atau password salah.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_memvalidasi_input(): void
    {
        $this->postJson('/api/login', ['email' => 'bukan-email'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_route_admin_menolak_tanpa_token(): void
    {
        $this->getJson('/api/admin/contacts')->assertStatus(401);
    }
}
