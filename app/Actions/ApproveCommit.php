<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\CommitStatus;
use App\Models\Commit;

final readonly class ApproveCommit
{
    public function handle(Commit $commit): void
    {
        $commit->update(['status' => CommitStatus::Approved]);
    }
}
