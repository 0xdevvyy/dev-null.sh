import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import CommitApprovalController from '@/actions/App/Http/Controllers/CommitApprovalController';
import CommitRejectionController from '@/actions/App/Http/Controllers/CommitRejectionController';
import { CommitFeed, EmptyFeed } from '@/components/commit-feed';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Commit, CursorPaginated } from '@/types';

function ModerationActions({ commit }: { commit: Commit }) {
    const [processing, setProcessing] = useState(false);

    const moderate = (
        route:
            | typeof CommitApprovalController.store
            | typeof CommitRejectionController.store,
    ) =>
        router.visit(route(commit), {
            preserveScroll: true,
            reset: ['commits'],
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });

    return (
        <div className="mt-3 flex gap-2">
            <Button
                size="sm"
                disabled={processing}
                onClick={() => moderate(CommitApprovalController.store)}
                data-test="approve-commit-button"
            >
                <Check />
                Approve
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={processing}
                onClick={() => moderate(CommitRejectionController.store)}
                data-test="reject-commit-button"
            >
                <X />
                Reject
            </Button>
        </div>
    );
}

export default function Show({
    commits,
}: {
    commits: CursorPaginated<Commit>;
}) {
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
                actions={(commit) => <ModerationActions commit={commit} />}
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
