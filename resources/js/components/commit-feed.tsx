import { InfiniteScroll } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { CommitCard } from '@/components/commit-card';
import { GraphRail } from '@/components/graph-rail';
import { Spinner } from '@/components/ui/spinner';
import { laneFor } from '@/lib/utils';
import type { Commit, CursorPaginated } from '@/types';

export function CommitFeed({
    commits,
    empty,
    end,
    firstLane,
}: {
    commits: CursorPaginated<Commit>;
    empty: ReactNode;
    end: string;
    firstLane?: string;
}) {
    if (commits.data.length === 0) {
        return <div className="px-6 py-16 text-center sm:px-12">{empty}</div>;
    }

    const lastCommit = commits.data.at(-1);

    return (
        <>
            <InfiniteScroll
                data="commits"
                onlyNext
                preserveUrl
                loading={
                    <div className="flex justify-center py-6">
                        <Spinner className="text-muted-foreground" />
                    </div>
                }
            >
                {commits.data.map((commit, index) => (
                    <CommitCard
                        key={commit.id}
                        commit={commit}
                        previousLane={
                            index === 0
                                ? firstLane
                                : laneFor(commits.data[index - 1].user_id)
                        }
                    />
                ))}
            </InfiniteScroll>

            {commits.next_cursor === null && lastCommit && (
                <div className="flex">
                    <GraphRail
                        lane={laneFor(lastCommit.user_id)}
                        previousLane={laneFor(lastCommit.user_id)}
                        variant="root"
                        hasTail={false}
                    />
                    <p className="pt-[1.3rem] pr-4 pb-10 text-sm text-muted-foreground">
                        {end}
                    </p>
                </div>
            )}
        </>
    );
}

export function EmptyFeed({
    command,
    children,
}: {
    command: string;
    children: ReactNode;
}) {
    return (
        <>
            <p className="font-mono text-[13px] text-muted-foreground">
                {command}
            </p>
            <div className="mx-auto mt-3 max-w-sm text-[15px] text-pretty">
                {children}
            </div>
        </>
    );
}
