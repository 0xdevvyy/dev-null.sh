import { Head, Link } from '@inertiajs/react';
import LogController from '@/actions/App/Http/Controllers/LogController';
import { CommitComposer } from '@/components/commit-composer';
import { CommitFeed } from '@/components/commit-feed';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { Commit, CursorPaginated, Log } from '@/types';

const tabs: { log: Log; title: string }[] = [
    { log: 'following', title: 'Following' },
    { log: 'everyone', title: 'Everyone' },
];

export default function Show({
    log,
    commits,
}: {
    log: Log;
    commits: CursorPaginated<Commit>;
}) {
    return (
        <>
            <Head title={log === 'following' ? 'Log' : 'Explore'} />

            <div className="mx-auto w-full max-w-2xl border-x border-sidebar-border/70 dark:border-sidebar-border">
                <nav
                    className="flex border-b border-sidebar-border/70 dark:border-sidebar-border"
                    aria-label="Logs"
                >
                    {tabs.map((tab) => (
                        <Link
                            key={tab.log}
                            href={LogController.show(tab.log)}
                            prefetch
                            className={cn(
                                'flex-1 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-accent',
                                {
                                    'border-b-2 border-foreground text-foreground':
                                        tab.log === log,
                                },
                            )}
                        >
                            {tab.title}
                        </Link>
                    ))}
                </nav>

                <CommitComposer />

                <CommitFeed
                    commits={commits}
                    empty={
                        log === 'following' ? (
                            <>
                                Your log is empty. Follow some developers from
                                the{' '}
                                <Link
                                    href={LogController.show('everyone')}
                                    className="font-medium text-foreground underline underline-offset-4"
                                >
                                    Everyone
                                </Link>{' '}
                                log.
                            </>
                        ) : (
                            'Nobody has committed anything yet. Be the first!'
                        )
                    }
                />
            </div>
        </>
    );
}

Show.layout = [AppLayout, {}];
