<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Commit;
use App\Models\User;

final readonly class CreateCommit
{
    public function handle(User $user, string $title, ?string $description = null): Commit
    {
        return $user->commits()->create([
            'title' => $title,
            'description' => $description,
        ]);
    }
}
