<?php

declare(strict_types=1);

use App\Models\User;

it('lists who a user is following', function (): void {
    $user = User::factory()->create(['username' => 'octocat']);
    $followed = User::factory()->create();
    $user->following()->attach($followed);
    $user->followers()->attach(User::factory()->create());

    $response = $this->actingAs(User::factory()->create())
        ->get(route('user-following.index', $user));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('user/connections')
            ->where('type', 'following')
            ->where('user.username', 'octocat')
            ->has('users.data', 1)
            ->where('users.data.0.id', $followed->id));
});

it('requires authentication', function (): void {
    $user = User::factory()->create();

    $response = $this->get(route('user-following.index', $user));

    $response->assertRedirectToRoute('home');
});
