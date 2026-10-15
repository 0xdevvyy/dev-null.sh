<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

interface TimelineQuery
{
    /**
     * @return Builder<Post>
     */
    public function builder(User $user): Builder;
}
