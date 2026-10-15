import { InfiniteScroll } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { GraphRail } from '@/components/graph-rail';
import { PostCard } from '@/components/post-card';
import { Spinner } from '@/components/ui/spinner';
import { laneFor } from '@/lib/utils';
import type { CursorPaginated, Post } from '@/types';

export function PostFeed({
    posts,
    empty,
    end,
    firstLane,
}: {
    posts: CursorPaginated<Post>;
    empty: ReactNode;
    end: string;
    firstLane?: string;
}) {
    if (posts.data.length === 0) {
        return <div className="px-6 py-16 text-center sm:px-12">{empty}</div>;
    }

    const lastPost = posts.data.at(-1);

    return (
        <>
            <InfiniteScroll
                data="posts"
                onlyNext
                preserveUrl
                loading={
                    <div className="flex justify-center py-6">
                        <Spinner className="text-muted-foreground" />
                    </div>
                }
            >
                {posts.data.map((post, index) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        previousLane={
                            index === 0
                                ? firstLane
                                : laneFor(posts.data[index - 1].user_id)
                        }
                    />
                ))}
            </InfiniteScroll>

            {posts.next_cursor === null && lastPost && (
                <div className="flex">
                    <GraphRail
                        lane={laneFor(lastPost.user_id)}
                        previousLane={laneFor(lastPost.user_id)}
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
