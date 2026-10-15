<?php

declare(strict_types=1);

namespace App\Enums;

use App\Queries\EveryoneTimelineQuery;
use App\Queries\FollowingTimelineQuery;
use App\Queries\TimelineQuery;

enum Timeline: string
{
    case Following = 'following';
    case Everyone = 'everyone';

    public function query(): TimelineQuery
    {
        return resolve(match ($this) {
            self::Following => FollowingTimelineQuery::class,
            self::Everyone => EveryoneTimelineQuery::class,
        });
    }
}
