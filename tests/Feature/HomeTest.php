<?php

declare(strict_types=1);

use App\Enums\Timeline;
use App\Models\User;

it('renders the landing page for guests', function (): void {
    $response = $this->get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('welcome'));
});

it('redirects authenticated users to the timeline', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->get(route('home'));

    $response->assertRedirectToRoute('timeline.show', Timeline::Following);
});
