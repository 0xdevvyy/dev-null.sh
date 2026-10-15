<?php

declare(strict_types=1);

use App\Models\Commit;
use App\Models\User;

test('to array', function (): void {
    $user = User::factory()->create()->refresh();

    expect(array_keys($user->toArray()))
        ->toBe([
            'id',
            'username',
            'name',
            'avatar_url',
            'bio',
            'location',
            'website',
            'company',
            'created_at',
            'updated_at',
        ]);
});

it('has commits', function (): void {
    $user = User::factory()->create();
    Commit::factory()->for($user)->count(2)->create();
    Commit::factory()->create();

    expect($user->commits)->toHaveCount(2);
});

it('has following and followers', function (): void {
    $user = User::factory()->create();
    $followed = User::factory()->create();
    $follower = User::factory()->create();

    $user->following()->attach($followed);
    $user->followers()->attach($follower);

    expect($user->following->modelKeys())->toBe([$followed->id])
        ->and($user->followers->modelKeys())->toBe([$follower->id])
        ->and($followed->followers->modelKeys())->toBe([$user->id]);
});

it('knows if it is following a user', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();

    expect($user->isFollowing($other))->toBeFalse();

    $user->following()->attach($other);

    expect($user->isFollowing($other))->toBeTrue()
        ->and($other->isFollowing($user))->toBeFalse();
});

it('has no password', function (): void {
    $user = User::factory()->create();

    expect($user->getAuthPassword())->toBe('');
});
