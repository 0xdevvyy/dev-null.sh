<?php

declare(strict_types=1);

namespace App\Enums;

use App\Queries\EveryoneLogQuery;
use App\Queries\FollowingLogQuery;
use App\Queries\LogQuery;

enum Log: string
{
    case Following = 'following';
    case Everyone = 'everyone';

    public function query(): LogQuery
    {
        return resolve(match ($this) {
            self::Following => FollowingLogQuery::class,
            self::Everyone => EveryoneLogQuery::class,
        });
    }
}
