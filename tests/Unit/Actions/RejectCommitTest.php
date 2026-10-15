<?php

declare(strict_types=1);

use App\Actions\RejectCommit;
use App\Enums\CommitStatus;
use App\Models\Commit;

it('may reject a commit', function (): void {
    $commit = Commit::factory()->pending()->create();

    $action = resolve(RejectCommit::class);

    $action->handle($commit);

    expect($commit->refresh()->status)->toBe(CommitStatus::Rejected);
});
