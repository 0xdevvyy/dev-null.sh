<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

final readonly class GitHub
{
    public function api(): PendingRequest
    {
        $request = Http::baseUrl('https://api.github.com')
            ->accept('application/vnd.github+json')
            ->withHeaders(['X-GitHub-Api-Version' => '2022-11-28'])
            ->connectTimeout(3)
            ->timeout(5);

        $clientId = config('services.github.client_id');
        $clientSecret = config('services.github.client_secret');

        // Authenticating as the OAuth app raises the rate limit from 60 to 5,000 requests per hour.
        if (is_string($clientId) && is_string($clientSecret)) {
            $request->withBasicAuth($clientId, $clientSecret);
        }

        return $request;
    }
}
