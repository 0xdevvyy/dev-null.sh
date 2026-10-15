import type { CSSProperties } from 'react';
import type { ActivityDay } from '@/types';

const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const weekdayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const levelMix = [0, 32, 56, 80, 100];

function levelColor(level: number): string {
    return level === 0
        ? 'var(--muted)'
        : `color-mix(in oklab, var(--lane) ${levelMix[level]}%, var(--card))`;
}

function monthOf(date: string): number {
    return Number(date.slice(5, 7)) - 1;
}

function formatDay(date: string): string {
    return `${monthNames[monthOf(date)]} ${Number(date.slice(8, 10))}, ${date.slice(0, 4)}`;
}

function describe(day: ActivityDay): string {
    if (day.count === 0) {
        return `No commits on ${formatDay(day.date)}`;
    }

    return `${day.count} ${day.count === 1 ? 'commit' : 'commits'} on ${formatDay(day.date)}`;
}

export function ActivityGraph({
    activity,
    lane,
}: {
    activity: ActivityDay[];
    lane: string;
}) {
    const total = activity.reduce((sum, day) => sum + day.count, 0);
    const max = Math.max(1, ...activity.map((day) => day.count));

    const weekStarts = activity.filter((_, index) => index % 7 === 0);
    const monthLabels = weekStarts.map((day, index) => {
        const changesMonth =
            index === 0 ||
            monthOf(day.date) !== monthOf(weekStarts[index - 1].date);
        const nextLabelIsClose =
            index === 0 &&
            weekStarts
                .slice(1, 3)
                .some((week) => monthOf(week.date) !== monthOf(day.date));

        return changesMonth && !nextLabelIsClose
            ? monthNames[monthOf(day.date)]
            : null;
    });

    const columns = {
        gridTemplateColumns: `repeat(${weekStarts.length}, minmax(0, 1fr))`,
    };

    return (
        <section
            aria-labelledby="activity-heading"
            className="border-b px-4 py-5 sm:px-6"
            style={{ '--lane': lane } as CSSProperties}
        >
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 id="activity-heading" className="text-sm font-semibold">
                    Commit activity
                </h2>
                <p className="text-sm text-muted-foreground">
                    <span className="font-mono text-foreground">{total}</span>{' '}
                    {total === 1 ? 'commit' : 'commits'} in the last year
                </p>
            </div>

            <div
                ref={(node) => {
                    if (node) {
                        node.scrollLeft = node.scrollWidth;
                    }
                }}
                className="overflow-x-auto pb-1"
            >
                <div
                    role="img"
                    aria-label={`${total} ${total === 1 ? 'commit' : 'commits'} in the last year`}
                    className="grid min-w-[34rem] grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5"
                >
                    <span aria-hidden />
                    <div
                        aria-hidden
                        className="grid text-xs text-muted-foreground"
                        style={columns}
                    >
                        {monthLabels.map((label, index) => (
                            <span
                                key={weekStarts[index].date}
                                className="overflow-visible whitespace-nowrap"
                            >
                                {label}
                            </span>
                        ))}
                    </div>

                    <div
                        aria-hidden
                        className="grid grid-rows-7 gap-[3px] text-xs text-muted-foreground"
                    >
                        {weekdayLabels.map((label, index) => (
                            <span
                                key={index}
                                className="flex items-center leading-none"
                            >
                                {label}
                            </span>
                        ))}
                    </div>

                    <div
                        className="grid grid-flow-col grid-rows-7 gap-[3px]"
                        style={columns}
                    >
                        {activity.map((day) => (
                            <span
                                key={day.date}
                                title={describe(day)}
                                className="aspect-square rounded-[2px]"
                                style={{
                                    background: levelColor(
                                        day.count === 0
                                            ? 0
                                            : Math.max(
                                                  1,
                                                  Math.ceil(
                                                      (day.count / max) * 4,
                                                  ),
                                              ),
                                    ),
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div
                aria-hidden
                className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground"
            >
                <span className="mr-1">Less</span>
                {levelMix.map((_, level) => (
                    <span
                        key={level}
                        className="size-2.5 rounded-[2px]"
                        style={{ background: levelColor(level) }}
                    />
                ))}
                <span className="ml-1">More</span>
            </div>
        </section>
    );
}
