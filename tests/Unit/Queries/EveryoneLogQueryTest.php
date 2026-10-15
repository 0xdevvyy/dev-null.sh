<?php

declare(strict_types=1);

use App\Models\Commit;
use App\Models\User;
use App\Queries\EveryoneLogQuery;

it('includes commits of everyone newest first', function (): void {
    $older = Commit::factory()->create(['created_at' => now()->subMinute()]);
    $newer = Commit::factory()->create();

    $query = resolve(EveryoneLogQuery::class);

    $commits = $query->builder(User::factory()->create())->get();

    expect($commits->modelKeys())->toBe([$newer->id, $older->id])
        ->and($commits->first()->relationLoaded('user'))->toBeTrue();
});
