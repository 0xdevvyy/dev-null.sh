<?php

declare(strict_types=1);

use App\Actions\UnfollowUser;
use App\Models\User;

it('may unfollow a user', function (): void {
    $follower = User::factory()->create();
    $user = User::factory()->create();

    $follower->following()->attach($user);

    $action = resolve(UnfollowUser::class);

    $action->handle($follower, $user);

    expect($follower->isFollowing($user))->toBeFalse();
});

it('does nothing when not following', function (): void {
    $follower = User::factory()->create();
    $user = User::factory()->create();

    $action = resolve(UnfollowUser::class);

    $action->handle($follower, $user);

    expect($follower->following()->count())->toBe(0);
});
