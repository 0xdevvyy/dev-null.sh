<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\RejectCommit;
use App\Models\Commit;
use Illuminate\Http\RedirectResponse;

final readonly class CommitRejectionController
{
    public function store(Commit $commit, RejectCommit $action): RedirectResponse
    {
        $action->handle($commit);

        return back();
    }
}
