<?php

declare(strict_types=1);

use App\Actions\DeletePost;
use App\Models\Post;

it('may delete a post', function (): void {
    $post = Post::factory()->create();

    $action = resolve(DeletePost::class);

    $action->handle($post);

    expect($post->exists)->toBeFalse();
});
