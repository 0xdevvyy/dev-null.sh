<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Commit;
use App\Models\User;
use InvalidArgumentException;

final readonly class StarCommit
{
    public function handle(User $user, Commit $commit): void
    {
        throw_unless($commit->isVisibleTo($user), InvalidArgumentException::class, 'Commits can only be starred when they are visible.');

        $user->starredCommits()->syncWithoutDetaching([$commit->id]);
    }
}
