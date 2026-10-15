<?php

declare(strict_types=1);

use App\Actions\DeleteCommit;
use App\Models\Commit;

it('may delete a commit', function (): void {
    $commit = Commit::factory()->create();

    $action = resolve(DeleteCommit::class);

    $action->handle($commit);

    expect($commit->exists)->toBeFalse();
});
