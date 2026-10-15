<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreatePost;
use App\Actions\DeletePost;
use App\Http\Requests\CreatePostRequest;
use App\Http\Requests\DeletePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;

final readonly class PostController
{
    public function store(CreatePostRequest $request, #[CurrentUser] User $user, CreatePost $action): RedirectResponse
    {
        $action->handle($user, $request->string('body')->value());

        return back();
    }

    public function destroy(DeletePostRequest $request, Post $post, DeletePost $action): RedirectResponse
    {
        $action->handle($post);

        return back();
    }
}
