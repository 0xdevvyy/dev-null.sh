<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\User;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;

final readonly class UserActivityQuery
{
    /**
     * @return list<array{date: string, count: int}>
     */
    public function get(User $user): array
    {
        $today = CarbonImmutable::now();
        $from = $today->subWeeks(52)->startOfWeek(CarbonInterface::SUNDAY);

        $counts = $user->commits()
            ->where('created_at', '>=', $from)
            ->selectRaw('date(created_at) as day, count(*) as aggregate')
            ->groupBy('day')
            ->pluck('aggregate', 'day')
            ->map(fn (mixed $count): int => is_numeric($count) ? (int) $count : 0)
            ->all();

        return array_values(array_map(
            fn (CarbonInterface $day): array => [
                'date' => $day->toDateString(),
                'count' => $counts[$day->toDateString()] ?? 0,
            ],
            CarbonPeriod::create($from, $today->startOfDay())->toArray(),
        ));
    }
}
