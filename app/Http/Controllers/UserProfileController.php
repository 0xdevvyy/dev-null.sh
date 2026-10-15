<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

final readonly class UserProfileController
{
    public function edit(): Response
    {
        return Inertia::render('user-profile/edit');
    }
}
