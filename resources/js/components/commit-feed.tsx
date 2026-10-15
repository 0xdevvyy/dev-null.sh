import { InfiniteScroll } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { CommitCard } from '@/components/commit-card';
import { Spinner } from '@/components/ui/spinner';
import type { Commit, CursorPaginated } from '@/types';

export function CommitFeed({
    commits,
    empty,
}: {
    commits: CursorPaginated<Commit>;
    empty: ReactNode;
}) {
    if (commits.data.length === 0) {
        return (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                {empty}
            </div>
        );
    }

    return (
        <InfiniteScroll
            data="commits"
            onlyNext
            preserveUrl
            loading={
                <div className="flex justify-center py-6">
                    <Spinner />
                </div>
            }
        >
            {commits.data.map((commit) => (
                <CommitCard key={commit.id} commit={commit} />
            ))}
        </InfiniteScroll>
    );
}
