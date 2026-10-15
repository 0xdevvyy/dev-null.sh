<?php

declare(strict_types=1);

use App\Models\User;

it("lists a user's followers", function (): void {
    $user = User::factory()->create(['username' => 'octocat']);
    $follower = User::factory()->create();
    $user->followers()->attach($follower);
    $user->following()->attach(User::factory()->create());

    $response = $this->actingAs(User::factory()->create())
        ->get(route('user-followers.index', $user));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('user/connections')
            ->where('type', 'followers')
            ->has('users.data', 1)
            ->where('users.data.0.id', $follower->id)
            ->missing('users.data.0.email'));
});

it('requires authentication', function (): void {
    $user = User::factory()->create();

    $response = $this->get(route('user-followers.index', $user));

    $response->assertRedirectToRoute('home');
});
