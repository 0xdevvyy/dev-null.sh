import { Head, Link } from '@inertiajs/react';
import TimelineController from '@/actions/App/Http/Controllers/TimelineController';
import { PostComposer } from '@/components/post-composer';
import { PostFeed } from '@/components/post-feed';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { CursorPaginated, Post, Timeline } from '@/types';

const tabs: { timeline: Timeline; title: string }[] = [
    { timeline: 'following', title: 'Following' },
    { timeline: 'everyone', title: 'Everyone' },
];

export default function Show({
    timeline,
    posts,
}: {
    timeline: Timeline;
    posts: CursorPaginated<Post>;
}) {
    return (
        <>
            <Head title={timeline === 'following' ? 'Timeline' : 'Explore'} />

            <div className="mx-auto w-full max-w-2xl border-x border-sidebar-border/70 dark:border-sidebar-border">
                <nav
                    className="flex border-b border-sidebar-border/70 dark:border-sidebar-border"
                    aria-label="Timelines"
                >
                    {tabs.map((tab) => (
                        <Link
                            key={tab.timeline}
                            href={TimelineController.show(tab.timeline)}
                            prefetch
                            className={cn(
                                'flex-1 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-accent',
                                {
                                    'border-b-2 border-foreground text-foreground':
                                        tab.timeline === timeline,
                                },
                            )}
                        >
                            {tab.title}
                        </Link>
                    ))}
                </nav>

                <PostComposer />

                <PostFeed
                    posts={posts}
                    empty={
                        timeline === 'following' ? (
                            <>
                                Your timeline is empty. Follow some developers
                                from the{' '}
                                <Link
                                    href={TimelineController.show('everyone')}
                                    className="font-medium text-foreground underline underline-offset-4"
                                >
                                    Everyone
                                </Link>{' '}
                                timeline.
                            </>
                        ) : (
                            'Nobody has posted anything yet. Be the first!'
                        )
                    }
                />
            </div>
        </>
    );
}

Show.layout = [AppLayout, {}];
