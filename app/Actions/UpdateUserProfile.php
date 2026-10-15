<?php

declare(strict_types=1);

namespace App\Actions;

use App\Dto\GitHubProfile;
use App\Models\User;
use App\Services\GitHub;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;

/**
 * Mirrors the GitHub profile and SSH keys of a user again, without them having to sign in.
 */
final readonly class UpdateUserProfile
{
    public function __construct(
        private GitHub $github,
        private UpdateUserSshKeys $updateUserSshKeys,
    ) {
        //
    }

    public function handle(User $user): bool
    {
        try {
            // Look the account up by its immutable ID: a username can be renamed and then claimed by someone else.
            /** @var array<array-key, mixed> $account */
            $account = $this->github->api()->get("user/{$user->github_id}")->throw()->json();

            $this->updateUserSshKeys->handle($user);

            // The email is left alone: the public API only has the public one, sign-in also knows the private one.
            $user->update([
                ...GitHubProfile::fromAccount($account)->attributes(),
                'github_synced_at' => now(),
            ]);
        } catch (ConnectionException|RequestException|UniqueConstraintViolationException $exception) {
            report($exception);

            return false;
        }

        return true;
    }
}
