<?php

declare(strict_types=1);

use App\Enums\CommitStatus;
use App\Models\Commit;
use App\Models\User;

test('to array', function (): void {
    $commit = Commit::factory()->create()->refresh();

    expect(array_keys($commit->toArray()))
        ->toBe([
            'id',
            'user_id',
            'body',
            'created_at',
            'updated_at',
            'status',
            'parent_id',
        ]);
});

it('belongs to a user', function (): void {
    $user = User::factory()->create();
    $commit = Commit::factory()->for($user)->create();

    expect($commit->user->is($user))->toBeTrue();
});

it('casts the status to an enum', function (): void {
    $commit = Commit::factory()->pending()->create()->refresh();

    expect($commit->status)->toBe(CommitStatus::Pending);
});

it('is visible when approved or owned', function (): void {
    $author = User::factory()->create();
    $viewer = User::factory()->create();
    $approved = Commit::factory()->for($author)->create();
    $pending = Commit::factory()->for($author)->pending()->create();
    $rejected = Commit::factory()->for($author)->rejected()->create();

    expect($approved->isVisibleTo($viewer))->toBeTrue()
        ->and($pending->isVisibleTo($author))->toBeTrue()
        ->and($pending->isVisibleTo($viewer))->toBeFalse()
        ->and($rejected->isVisibleTo($author))->toBeTrue()
        ->and($rejected->isVisibleTo($viewer))->toBeFalse();
});

it('deletes stars with the commit', function (): void {
    $user = User::factory()->create();
    $commit = Commit::factory()->create();

    $user->starredCommits()->attach($commit);

    $commit->delete();

    expect($user->starredCommits()->count())->toBe(0);
});

it('may reply to another commit', function (): void {
    $parent = Commit::factory()->create();
    $reply = Commit::factory()->for($parent, 'parent')->create();

    expect($reply->parent->is($parent))->toBeTrue()
        ->and($parent->replies->sole()->is($reply))->toBeTrue();
});

it('deletes replies along with their parent', function (): void {
    $parent = Commit::factory()->create();
    $reply = Commit::factory()->for($parent, 'parent')->create();
    $nested = Commit::factory()->for($reply, 'parent')->create();

    $parent->delete();

    expect($reply->fresh())->toBeNull()
        ->and($nested->fresh())->toBeNull();
});
