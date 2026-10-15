<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;

it('renders a user profile', function (): void {
    $user = User::factory()->create(['username' => 'octocat']);
    $viewer = User::factory()->create();

    $user->followers()->attach($viewer);
    $user->following()->attach(User::factory()->count(2)->create());

    Post::factory()->for($user)->create(['created_at' => now()->subDay(), 'body' => 'Older']);
    Post::factory()->for($user)->create(['body' => 'Newer']);
    Post::factory()->create();

    $response = $this->actingAs($viewer)
        ->get('/@octocat');

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('user/show')
            ->where('user.id', $user->id)
            ->where('user.username', 'octocat')
            ->where('user.posts_count', 2)
            ->where('user.followers_count', 1)
            ->where('user.following_count', 2)
            ->missing('user.email')
            ->missing('user.github_id')
            ->where('isFollowing', true)
            ->has('posts.data', 2)
            ->where('posts.data.0.body', 'Newer')
            ->where('posts.data.0.user.username', 'octocat')
            ->where('posts.data.1.body', 'Older'));
});

it('renders whether the viewer is not following the user', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs(User::factory()->create())
        ->get(route('user.show', $user));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('isFollowing', false)
            ->has('posts.data', 0));
});

it('returns not found for unknown usernames', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->get('/@missing');

    $response->assertNotFound();
});

it('requires authentication to view a profile', function (): void {
    $user = User::factory()->create();

    $response = $this->get(route('user.show', $user));

    $response->assertRedirectToRoute('home');
});

it('may delete user account', function (): void {
    $user = User::factory()->create();
    Post::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->fromRoute('user-profile.edit')
        ->delete(route('user.destroy'));

    $response->assertRedirectToRoute('home');

    expect($user->fresh())->toBeNull()
        ->and(Post::query()->count())->toBe(0);

    $this->assertGuest();
});
