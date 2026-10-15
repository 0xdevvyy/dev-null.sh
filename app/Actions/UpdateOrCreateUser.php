<?php

declare(strict_types=1);

namespace App\Actions;

use App\Dto\GitHubProfile;
use App\Models\User;
use Laravel\Socialite\Two\User as GitHubUser;

final readonly class UpdateOrCreateUser
{
    public function handle(GitHubUser $githubUser): User
    {
        $email = mb_trim((string) $githubUser->getEmail());

        return User::query()->updateOrCreate([
            'github_id' => (string) $githubUser->getId(),
        ], [
            ...GitHubProfile::fromSocialite($githubUser)->attributes(),
            'email' => $email === '' ? null : $email,
            'github_synced_at' => now(),
        ]);
    }
}
