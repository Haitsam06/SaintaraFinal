<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RolesSeeder::class,
            AdminsSeeder::class,
            CustomersSeeder::class,
            InstansisSeeder::class,
            PaketsSeeder ::class,
        ]);
    }
    /**
     * Seed the application's database.
     */
    // public function run(): void
    // {
    //     // User::factory(10)->create();

    //     User::firstOrCreate(
    //         ['email' => 'test@example.com'],
    //         [
    //             'name' => 'Test User',
    //             'password' => 'password',
    //             'email_verified_at' => now(),
    //         ]
    //     );
    // }
}
