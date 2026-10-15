<?php

declare(strict_types=1);

use App\Enums\Timeline;
use App\Models\Post;
use App\Models\User;

it('renders own posts and posts of followed users newest first', function (): void {
    $user = User::factory()->create();
    $followed = User::factory()->create();
    $stranger = User::factory()->create();

    $user->following()->attach($followed);

    Post::factory()->for($user)->create(['body' => 'Mine', 'created_at' => now()->subMinutes(2)]);
    Post::factory()->for($followed)->create(['body' => 'Followed', 'created_at' => now()->subMinute()]);
    Post::factory()->for($stranger)->create(['body' => 'Stranger']);

    $response = $this->actingAs($user)
        ->get('/timelines/following');

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('timeline/show')
            ->where('timeline', 'following')
            ->has('posts.data', 2)
            ->where('posts.data.0.body', 'Followed')
            ->where('posts.data.0.user.id', $followed->id)
            ->missing('posts.data.0.user.email')
            ->where('posts.data.1.body', 'Mine'));
});

it('renders posts of everyone newest first', function (): void {
    $user = User::factory()->create();

    Post::factory()->create(['body' => 'Older', 'created_at' => now()->subMinute()]);
    Post::factory()->create(['body' => 'Newer']);

    $response = $this->actingAs($user)
        ->get('/timelines/everyone');

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('timeline/show')
            ->where('timeline', 'everyone')
            ->has('posts.data', 2)
            ->where('posts.data.0.body', 'Newer')
            ->where('posts.data.1.body', 'Older'));
});

it('paginates the timeline', function (Timeline $timeline): void {
    $user = User::factory()->create();

    Post::factory()->for($user)->count(25)->sequence(
        fn ($sequence): array => ['created_at' => now()->subMinutes($sequence->index)],
    )->create();

    $response = $this->actingAs($user)
        ->get(route('timeline.show', $timeline));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('posts.data', 20)
            ->whereNot('posts.next_cursor', null));
})->with(Timeline::cases());

it('returns not found for unknown timelines', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->get('/timelines/unknown');

    $response->assertNotFound();
});

it('requires authentication', function (Timeline $timeline): void {
    $response = $this->get(route('timeline.show', $timeline));

    $response->assertRedirectToRoute('home');
})->with(Timeline::cases());
