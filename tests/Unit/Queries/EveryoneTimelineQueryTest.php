<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;
use App\Queries\EveryoneTimelineQuery;

it('includes posts of everyone newest first', function (): void {
    $older = Post::factory()->create(['created_at' => now()->subMinute()]);
    $newer = Post::factory()->create();

    $query = resolve(EveryoneTimelineQuery::class);

    $posts = $query->builder(User::factory()->create())->get();

    expect($posts->modelKeys())->toBe([$newer->id, $older->id])
        ->and($posts->first()->relationLoaded('user'))->toBeTrue();
});
