<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\ApproveCommit;
use App\Models\Commit;
use Illuminate\Http\RedirectResponse;

final readonly class CommitApprovalController
{
    public function store(Commit $commit, ApproveCommit $action): RedirectResponse
    {
        $action->handle($commit);

        return back();
    }
}
