<?php

declare(strict_types=1);

use App\Actions\CreatePost;
use App\Models\User;

it('may create a post', function (): void {
    $user = User::factory()->create();

    $action = resolve(CreatePost::class);

    $post = $action->handle($user, 'Hello, devnull!');

    expect($post->exists)->toBeTrue()
        ->and($post->body)->toBe('Hello, devnull!')
        ->and($post->user->is($user))->toBeTrue();
});
