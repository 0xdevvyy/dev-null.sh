<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Commit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Commit>
 */
final class CommitFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->text(72),
            'description' => fake()->optional()->realText(200),
        ];
    }
}
