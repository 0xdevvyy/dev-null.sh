import { InfiniteScroll } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { PostCard } from '@/components/post-card';
import { Spinner } from '@/components/ui/spinner';
import type { CursorPaginated, Post } from '@/types';

export function PostFeed({
    posts,
    empty,
}: {
    posts: CursorPaginated<Post>;
    empty: ReactNode;
}) {
    if (posts.data.length === 0) {
        return (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                {empty}
            </div>
        );
    }

    return (
        <InfiniteScroll
            data="posts"
            onlyNext
            preserveUrl
            loading={
                <div className="flex justify-center py-6">
                    <Spinner />
                </div>
            }
        >
            {posts.data.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </InfiniteScroll>
    );
}
