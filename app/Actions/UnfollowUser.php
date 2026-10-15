<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;

final readonly class UnfollowUser
{
    public function handle(User $follower, User $followed): void
    {
        $follower->following()->detach($followed->id);
    }
}
