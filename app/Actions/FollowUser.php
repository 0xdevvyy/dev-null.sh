<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;
use InvalidArgumentException;

final readonly class FollowUser
{
    public function handle(User $follower, User $followed): void
    {
        throw_if($follower->is($followed), InvalidArgumentException::class, 'Users cannot follow themselves.');

        $follower->following()->syncWithoutDetaching([$followed->id]);
    }
}
