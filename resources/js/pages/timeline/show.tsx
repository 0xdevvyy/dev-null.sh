import { Head, Link } from '@inertiajs/react';
import TimelineController from '@/actions/App/Http/Controllers/TimelineController';
import { PageTabs } from '@/components/page-tabs';
import { PostComposer } from '@/components/post-composer';
import { EmptyFeed, PostFeed } from '@/components/post-feed';
import AppLayout from '@/layouts/app-layout';
import type { CursorPaginated, Post, Timeline } from '@/types';

export default function Show({
    timeline,
    posts,
}: {
    timeline: Timeline;
    posts: CursorPaginated<Post>;
}) {
    return (
        <>
            <Head title={timeline === 'following' ? 'Log' : 'Everyone'} />

            <div className="sticky top-0 z-10 bg-card">
                <h1 className="sr-only">
                    {timeline === 'following' ? 'Log' : 'Everyone'}
                </h1>
                <PageTabs
                    label="Timelines"
                    tabs={[
                        {
                            title: 'Log',
                            href: TimelineController.show('following'),
                            isActive: timeline === 'following',
                        },
                        {
                            title: 'Everyone',
                            href: TimelineController.show('everyone'),
                            isActive: timeline === 'everyone',
                        },
                    ]}
                />
            </div>

            <PostComposer />

            <PostFeed
                posts={posts}
                firstLane="var(--rail)"
                end="That's the root commit. There's nothing before it."
                empty={
                    timeline === 'following' ? (
                        <EmptyFeed command="fatal: your log does not have any commits yet">
                            Your log shows your commits and commits from people
                            you follow. Find someone worth following on{' '}
                            <Link
                                href={TimelineController.show('everyone')}
                                className="font-medium text-primary underline"
                            >
                                Everyone
                            </Link>
                            .
                        </EmptyFeed>
                    ) : (
                        <EmptyFeed command="fatal: no commits yet">
                            Nobody has committed anything. Be the first. It's
                            280 characters; you'll be fine.
                        </EmptyFeed>
                    )
                }
            />
        </>
    );
}

Show.layout = AppLayout;
