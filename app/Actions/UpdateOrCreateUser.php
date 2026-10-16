<?php

declare(strict_types=1);

namespace App\Actions;

use App\Dto\GitHubProfile;
use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Two\User as GitHubUser;

final readonly class UpdateOrCreateUser
{
    public function handle(GitHubUser $githubUser): User
    {
        $email = mb_trim((string) $githubUser->getEmail());

        $hasSponsorsListing = $this->hasSponsorsListing($githubUser->token);

        return User::query()->updateOrCreate([
            'github_id' => (string) $githubUser->getId(),
        ], [
            ...GitHubProfile::fromSocialite($githubUser)->attributes(),
            'email' => $email === '' ? null : $email,
            'github_synced_at' => now(),
            ...($hasSponsorsListing === null ? [] : ['has_sponsors_listing' => $hasSponsorsListing]),
        ]);
    }

    /**
     * Only a public listing has a sponsors page to link to. The REST API doesn't say, so this asks
     * GraphQL with the user's own token. Null when GitHub can't answer, which keeps the last known value.
     */
    private function hasSponsorsListing(string $token): ?bool
    {
        try {
            $response = Http::withToken($token)
                ->connectTimeout(2)
                ->timeout(3)
                ->post('https://api.github.com/graphql', [
                    'query' => 'query { viewer { sponsorsListing { isPublic } } }',
                ]);
        } catch (ConnectionException) {
            return null;
        }

        if ($response->failed() || $response->json('errors') !== null) {
            return null;
        }

        return $response->json('data.viewer.sponsorsListing.isPublic') === true;
    }
}
