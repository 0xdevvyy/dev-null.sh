<?php

declare(strict_types=1);

use App\Enums\Timeline;
use App\Queries\EveryoneTimelineQuery;
use App\Queries\FollowingTimelineQuery;

it('resolves the query of each timeline', function (Timeline $timeline, string $query): void {
    expect($timeline->query())->toBeInstanceOf($query);
})->with([
    [Timeline::Following, FollowingTimelineQuery::class],
    [Timeline::Everyone, EveryoneTimelineQuery::class],
]);
