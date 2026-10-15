<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\FollowUser;
use App\Actions\UnfollowUser;
use App\Http\Requests\CreateUserFollowRequest;
use App\Http\Requests\DeleteUserFollowRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;

final readonly class UserFollowController
{
    public function store(CreateUserFollowRequest $request, #[CurrentUser] User $follower, User $user, FollowUser $action): RedirectResponse
    {
        $action->handle($follower, $user);

        return back();
    }

    public function destroy(DeleteUserFollowRequest $request, #[CurrentUser] User $follower, User $user, UnfollowUser $action): RedirectResponse
    {
        $action->handle($follower, $user);

        return back();
    }
}
