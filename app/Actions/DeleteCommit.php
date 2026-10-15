<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Commit;

final readonly class DeleteCommit
{
    public function handle(Commit $commit): void
    {
        $commit->delete();
    }
}
