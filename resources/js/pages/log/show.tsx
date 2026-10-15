import { Head, Link } from '@inertiajs/react';
import LogController from '@/actions/App/Http/Controllers/LogController';
import { CommitComposer } from '@/components/commit-composer';
import { CommitFeed, EmptyFeed } from '@/components/commit-feed';
import { PageTabs } from '@/components/page-tabs';
import AppLayout from '@/layouts/app-layout';
import type { Commit, CursorPaginated, Log } from '@/types';

export default function Show({
    log,
    commits,
}: {
    log: Log;
    commits: CursorPaginated<Commit>;
}) {
    return (
        <>
            <Head title={log === 'following' ? 'Log' : 'Everyone'} />

            <div className="sticky top-0 z-10 bg-card">
                <h1 className="sr-only">
                    {log === 'following' ? 'Log' : 'Everyone'}
                </h1>
                <PageTabs
                    label="Logs"
                    tabs={[
                        {
                            title: 'Log',
                            href: LogController.show('following'),
                            isActive: log === 'following',
                        },
                        {
                            title: 'Everyone',
                            href: LogController.show('everyone'),
                            isActive: log === 'everyone',
                        },
                    ]}
                />
            </div>

            <CommitComposer />

            <CommitFeed
                commits={commits}
                firstLane="var(--rail)"
                end="That's the root commit. There's nothing before it."
                empty={
                    log === 'following' ? (
                        <EmptyFeed command="fatal: your log does not have any commits yet">
                            Your log shows your commits and commits from people
                            you follow. Find someone worth following on{' '}
                            <Link
                                href={LogController.show('everyone')}
                                className="font-medium text-primary underline"
                            >
                                Everyone
                            </Link>
                            .
                        </EmptyFeed>
                    ) : (
                        <EmptyFeed command="fatal: no commits yet">
                            Nobody has committed anything. Be the first. It's 72
                            characters; you'll be fine.
                        </EmptyFeed>
                    )
                }
            />
        </>
    );
}

Show.layout = AppLayout;
