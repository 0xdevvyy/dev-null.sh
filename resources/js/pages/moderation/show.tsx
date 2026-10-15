import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import CommitApprovalController from '@/actions/App/Http/Controllers/CommitApprovalController';
import CommitRejectionController from '@/actions/App/Http/Controllers/CommitRejectionController';
import { CommitFeed, EmptyFeed } from '@/components/commit-feed';
import { Button } from '@/components/ui/button';
import { focusCommit } from '@/hooks/use-keyboard-shortcuts';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { Commit, CursorPaginated } from '@/types';

type ModerationRoute =
    | typeof CommitApprovalController.store
    | typeof CommitRejectionController.store;

function Keycap({ label, className }: { label: string; className?: string }) {
    return (
        <kbd
            aria-hidden
            className={cn(
                '-mr-1 hidden min-w-5 rounded border border-b-2 px-1 text-center font-mono text-xs leading-4 sm:inline-block',
                className,
            )}
        >
            {label}
        </kbd>
    );
}

function ModerationActions({
    isDisabled,
    onModerate,
}: {
    isDisabled: boolean;
    onModerate: (route: ModerationRoute) => void;
}) {
    return (
        <div className="mt-3 flex gap-2">
            <Button
                size="sm"
                disabled={isDisabled}
                onClick={() => onModerate(CommitApprovalController.store)}
                aria-keyshortcuts="a"
                data-test="approve-commit-button"
            >
                <Check />
                Approve
                <Keycap
                    label="a"
                    className="border-primary-foreground/30 bg-primary-foreground/15"
                />
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={isDisabled}
                onClick={() => onModerate(CommitRejectionController.store)}
                aria-keyshortcuts="x"
                data-test="reject-commit-button"
            >
                <X />
                Reject
                <Keycap label="x" className="bg-muted" />
            </Button>
        </div>
    );
}

export default function Show({
    commits,
}: {
    commits: CursorPaginated<Commit>;
}) {
    const [isModerating, setIsModerating] = useState(false);

    const moderate = (commit: Commit, route: ModerationRoute) => {
        const index = commits.data.findIndex(({ id }) => id === commit.id);
        const neighbour = commits.data[index + 1] ?? commits.data[index - 1];

        setIsModerating(true);

        router.visit(route(commit), {
            preserveScroll: true,
            reset: ['commits'],
            onSuccess: () =>
                requestAnimationFrame(() => {
                    const row = neighbour
                        ? document.querySelector<HTMLElement>(
                              `[data-commit="${neighbour.id}"]`,
                          )
                        : null;

                    if (row) {
                        focusCommit(row);
                    }
                }),
            onFinish: () => setIsModerating(false),
        });
    };

    return (
        <>
            <Head title="Moderation" />

            <div className="sticky top-0 z-10 flex h-14 items-center border-b bg-card px-4">
                <h1 className="font-semibold">Moderation</h1>
                <p className="ml-auto text-sm text-muted-foreground">
                    Oldest first
                </p>
            </div>

            <CommitFeed
                commits={commits}
                firstLane="var(--rail)"
                end="That's every pending commit."
                actions={(commit) => (
                    <ModerationActions
                        isDisabled={isModerating}
                        onModerate={(route) => moderate(commit, route)}
                    />
                )}
                empty={
                    <EmptyFeed command="nothing to commit, working tree clean">
                        No commits are waiting for review.
                    </EmptyFeed>
                }
            />
        </>
    );
}

Show.layout = AppLayout;
