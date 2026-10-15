<?php

declare(strict_types=1);

use App\Enums\Timeline;
use App\Models\Post;
use App\Models\User;

it('may create a post', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->fromRoute('timeline.show', Timeline::Following)
        ->post(route('post.store'), [
            'body' => 'Hello, devnull!',
        ]);

    $response->assertRedirectToRoute('timeline.show', Timeline::Following);

    expect($user->posts()->sole()->body)->toBe('Hello, devnull!');
});

it('requires a body', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->fromRoute('timeline.show', Timeline::Following)
        ->post(route('post.store'), [
            'body' => '   ',
        ]);

    $response->assertRedirectToRoute('timeline.show', Timeline::Following)
        ->assertSessionHasErrors('body');

    expect(Post::query()->count())->toBe(0);
});

it('requires the body to be at least 3 characters', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->fromRoute('timeline.show', Timeline::Following)
        ->post(route('post.store'), [
            'body' => '  ab  ',
        ]);

    $response->assertRedirectToRoute('timeline.show', Timeline::Following)
        ->assertSessionHasErrors('body');

    expect(Post::query()->count())->toBe(0);
});

it('requires the body to be at most 280 characters', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->fromRoute('timeline.show', Timeline::Following)
        ->post(route('post.store'), [
            'body' => str_repeat('a', 281),
        ]);

    $response->assertRedirectToRoute('timeline.show', Timeline::Following)
        ->assertSessionHasErrors('body');

    expect(Post::query()->count())->toBe(0);
});

it('rate limits post creation', function (): void {
    $user = User::factory()->create();

    for ($i = 0; $i < 10; $i++) {
        $this->actingAs($user)
            ->fromRoute('timeline.show', Timeline::Following)
            ->post(route('post.store'), ['body' => "Post {$i}"])
            ->assertRedirectToRoute('timeline.show', Timeline::Following);
    }

    $response = $this->actingAs($user)
        ->fromRoute('timeline.show', Timeline::Following)
        ->post(route('post.store'), ['body' => 'One too many']);

    $response->assertTooManyRequests();

    expect($user->posts()->count())->toBe(10);
});

it('requires authentication to create a post', function (): void {
    $response = $this->post(route('post.store'), [
        'body' => 'Hello, devnull!',
    ]);

    $response->assertRedirectToRoute('home');

    expect(Post::query()->count())->toBe(0);
});

it('may delete own post', function (): void {
    $post = Post::factory()->create();

    $response = $this->actingAs($post->user)
        ->fromRoute('timeline.show', Timeline::Following)
        ->delete(route('post.destroy', $post));

    $response->assertRedirectToRoute('timeline.show', Timeline::Following);

    expect($post->fresh())->toBeNull();
});

it('may not delete posts of other users', function (): void {
    $post = Post::factory()->create();

    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('timeline.show', Timeline::Following)
        ->delete(route('post.destroy', $post));

    $response->assertForbidden();

    expect($post->fresh())->not->toBeNull();
});
