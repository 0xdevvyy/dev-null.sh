<?php

declare(strict_types=1);

use App\Actions\FollowUser;
use App\Models\User;

it('may follow a user', function (): void {
    $follower = User::factory()->create();
    $user = User::factory()->create();

    $action = resolve(FollowUser::class);

    $action->handle($follower, $user);

    expect($follower->isFollowing($user))->toBeTrue()
        ->and($user->isFollowing($follower))->toBeFalse();
});

it('is idempotent', function (): void {
    $follower = User::factory()->create();
    $user = User::factory()->create();

    $action = resolve(FollowUser::class);

    $action->handle($follower, $user);
    $action->handle($follower, $user);

    expect($follower->following()->count())->toBeOne();
});

it('may not follow themselves', function (): void {
    $user = User::factory()->create();

    $action = resolve(FollowUser::class);

    $action->handle($user, $user);
})->throws(InvalidArgumentException::class, 'Users cannot follow themselves.');
