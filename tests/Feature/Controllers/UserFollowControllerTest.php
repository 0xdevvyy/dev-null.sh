<?php

declare(strict_types=1);

use App\Models\User;

it('may follow a user', function (): void {
    $follower = User::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($follower)
        ->fromRoute('user.show', $user)
        ->post(route('user-follow.store', $user));

    $response->assertRedirectToRoute('user.show', $user);

    expect($follower->isFollowing($user))->toBeTrue();
});

it('may not follow themselves', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->fromRoute('user.show', $user)
        ->post(route('user-follow.store', $user));

    $response->assertForbidden();

    expect($user->following()->count())->toBe(0);
});

it('may unfollow a user', function (): void {
    $follower = User::factory()->create();
    $user = User::factory()->create();

    $follower->following()->attach($user);

    $response = $this->actingAs($follower)
        ->fromRoute('user.show', $user)
        ->delete(route('user-follow.destroy', $user));

    $response->assertRedirectToRoute('user.show', $user);

    expect($follower->isFollowing($user))->toBeFalse();
});

it('requires authentication to follow', function (): void {
    $user = User::factory()->create();

    $response = $this->post(route('user-follow.store', $user));

    $response->assertRedirectToRoute('home');

    expect($user->followers()->count())->toBe(0);
});
