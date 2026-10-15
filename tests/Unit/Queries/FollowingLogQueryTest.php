<?php

declare(strict_types=1);

use App\Models\Commit;
use App\Models\User;
use App\Queries\FollowingLogQuery;
use Illuminate\Support\Facades\DB;

it('includes own commits and commits of followed users newest first', function (): void {
    $user = User::factory()->create();
    $followed = User::factory()->create();

    $user->following()->attach($followed);

    $own = Commit::factory()->for($user)->create(['created_at' => now()->subMinute()]);
    $followedCommit = Commit::factory()->for($followed)->create();
    Commit::factory()->create();

    $query = resolve(FollowingLogQuery::class);

    $commits = $query->builder($user)->get();

    expect($commits->modelKeys())->toBe([$followedCommit->id, $own->id])
        ->and($commits->first()->relationLoaded('user'))->toBeTrue();
});

it('resolves followed users in a subquery instead of loading their ids', function (): void {
    $user = User::factory()->create();

    $user->following()->attach(User::factory()->count(3)->create());

    DB::enableQueryLog();

    $builder = resolve(FollowingLogQuery::class)->builder($user);

    expect(DB::getQueryLog())->toBeEmpty()
        ->and($builder->toSql())->toContain('select "followed_id" from "follows"');
});
