import { Link, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import CommitController from '@/actions/App/Http/Controllers/CommitController';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { formatRelativeTime } from '@/lib/utils';
import { show } from '@/routes/user';
import type { Commit } from '@/types';

export function CommitCard({ commit }: { commit: Commit }) {
    const { auth } = usePage().props;

    // UUIDv7 starts with a timestamp, so the random tail makes a better short hash.
    const hash = commit.id.replaceAll('-', '').slice(-7);

    return (
        <article
            className="flex gap-3 border-b border-sidebar-border/70 px-4 py-4 dark:border-sidebar-border"
            data-test="commit"
        >
            <Link href={show(commit.user)} className="shrink-0">
                <UserAvatar user={commit.user} className="size-10" />
            </Link>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm">
                    <Link
                        href={show(commit.user)}
                        className="truncate font-semibold hover:underline"
                    >
                        {commit.user.name}
                    </Link>
                    <span className="truncate text-muted-foreground">
                        @{commit.user.username}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <code className="shrink-0 font-mono text-xs text-muted-foreground">
                        {hash}
                    </code>
                    <span className="text-muted-foreground">·</span>
                    <time
                        dateTime={commit.created_at}
                        title={new Date(commit.created_at).toLocaleString()}
                        className="shrink-0 text-muted-foreground"
                    >
                        {formatRelativeTime(commit.created_at)}
                    </time>

                    {commit.user_id === auth.user.id && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto size-7 text-muted-foreground hover:text-destructive"
                            asChild
                        >
                            <Link
                                href={CommitController.destroy(commit)}
                                as="button"
                                preserveScroll
                                onBefore={() =>
                                    confirm(
                                        'Are you sure you want to delete this commit?',
                                    )
                                }
                                aria-label="Delete commit"
                                data-test="delete-commit-button"
                            >
                                <Trash2 />
                            </Link>
                        </Button>
                    )}
                </div>

                <p className="mt-1 text-sm font-medium break-words">
                    {commit.title}
                </p>

                {commit.description && (
                    <p className="mt-1 text-sm break-words whitespace-pre-wrap text-muted-foreground">
                        {commit.description}
                    </p>
                )}
            </div>
        </article>
    );
}
