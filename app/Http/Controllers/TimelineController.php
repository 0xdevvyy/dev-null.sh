<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Timeline;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Inertia\Inertia;
use Inertia\Response;

final readonly class TimelineController
{
    public function show(#[CurrentUser] User $user, Timeline $timeline): Response
    {
        return Inertia::render('timeline/show', [
            'timeline' => $timeline,
            'posts' => Inertia::scroll(fn () => $timeline->query()
                ->builder($user)
                ->cursorPaginate(20)),
        ]);
    }
}
