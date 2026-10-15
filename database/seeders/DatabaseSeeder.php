<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory()->count(10)->create();

        $users->each(function (User $user) use ($users): void {
            Post::factory()->for($user)->count(fake()->numberBetween(1, 10))->sequence(
                fn (): array => ['created_at' => fake()->dateTimeBetween('-1 month')],
            )->create();

            $user->following()->attach(
                $users->except([$user->id])->random(fake()->numberBetween(1, 5))->modelKeys(),
            );
        });
    }
}
