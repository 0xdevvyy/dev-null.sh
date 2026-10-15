<?php

declare(strict_types=1);

use App\Actions\CreateCommit;
use App\Models\User;

it('may create a commit', function (): void {
    $user = User::factory()->create();

    $action = resolve(CreateCommit::class);

    $commit = $action->handle($user, 'Initial commit', 'Hello, devnull!');

    expect($commit->exists)->toBeTrue()
        ->and($commit->title)->toBe('Initial commit')
        ->and($commit->description)->toBe('Hello, devnull!')
        ->and($commit->user->is($user))->toBeTrue();
});

it('may create a commit without a description', function (): void {
    $action = resolve(CreateCommit::class);

    $commit = $action->handle(User::factory()->create(), 'Initial commit');

    expect($commit->title)->toBe('Initial commit')
        ->and($commit->description)->toBeNull();
});
