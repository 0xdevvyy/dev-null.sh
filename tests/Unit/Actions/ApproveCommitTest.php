<?php

declare(strict_types=1);

use App\Actions\ApproveCommit;
use App\Enums\CommitStatus;
use App\Models\Commit;

it('may approve a commit', function (): void {
    $commit = Commit::factory()->pending()->create();

    $action = resolve(ApproveCommit::class);

    $action->handle($commit);

    expect($commit->refresh()->status)->toBe(CommitStatus::Approved);
});
