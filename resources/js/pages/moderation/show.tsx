import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import ApproveCommitsController from '@/actions/App/Http/Controllers/ApproveCommitsController';
import CommitApprovalController from '@/actions/App/Http/Controllers/CommitApprovalController';
import CommitRejectionController from '@/actions/App/Http/Controllers/CommitRejectionController';
import { CommitFeed, EmptyFeed } from '@/components/commit-feed';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import type { Commit, CursorPaginated } from '@/types';

function ModerationActions({
    commit,
    isSelected,
    disabled,
    onSelectedChange,
}: {
    commit: Commit;
    isSelected: boolean;
    disabled: boolean;
    onSelectedChange: (isSelected: boolean) => void;
}) {
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
        <div className="mt-3 flex items-center gap-2">
            <Checkbox
                checked={isSelected}
                disabled={processing || disabled}
                onCheckedChange={(checked) =>
                    onSelectedChange(checked === true)
                }
                aria-label="Select commit"
                className="mr-1"
                data-test="select-commit-checkbox"
            />
            <Button
                size="sm"
                disabled={processing || disabled}
                onClick={() => moderate(CommitApprovalController.store)}
                data-test="approve-commit-button"
            >
                <Check />
                Approve
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={processing || disabled}
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
    const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
    const [approving, setApproving] = useState(false);

    const selectedIds = commits.data
        .map((commit) => commit.id)
        .filter((id) => selected.has(id));
    const isAllSelected =
        commits.data.length > 0 && selectedIds.length === commits.data.length;

    const toggle = (id: string, isSelected: boolean) =>
        setSelected((current) => {
            const next = new Set(current);

            if (isSelected) {
                next.add(id);
            } else {
                next.delete(id);
            }

            return next;
        });

    const toggleAll = (isSelected: boolean) =>
        setSelected(
            new Set(isSelected ? commits.data.map((commit) => commit.id) : []),
        );

    const approveSelected = () =>
        router.visit(ApproveCommitsController(), {
            data: { commits: selectedIds },
            preserveScroll: true,
            reset: ['commits'],
            onStart: () => setApproving(true),
            onSuccess: () => setSelected(new Set()),
            onFinish: () => setApproving(false),
        });

    return (
        <>
            <Head title="Moderation" />

            <div className="sticky top-0 z-10 bg-card">
                <div className="flex h-14 items-center border-b px-4">
                    <h1 className="font-semibold">Moderation</h1>
                    <p className="ml-auto text-sm text-muted-foreground">
                        Oldest first
                    </p>
                </div>

                {commits.data.length > 0 && (
                    <div className="flex h-12 items-center gap-3 border-b px-4">
                        <Checkbox
                            id="select-all-commits"
                            checked={
                                isAllSelected
                                    ? true
                                    : selectedIds.length > 0
                                      ? 'indeterminate'
                                      : false
                            }
                            disabled={approving}
                            onCheckedChange={(checked) =>
                                toggleAll(checked === true)
                            }
                            data-test="select-all-commits-checkbox"
                        />
                        <label
                            htmlFor="select-all-commits"
                            className="text-sm text-muted-foreground"
                        >
                            {selectedIds.length > 0
                                ? `${selectedIds.length} selected`
                                : 'Select all'}
                        </label>
                        <Button
                            size="sm"
                            className="ml-auto"
                            disabled={approving || selectedIds.length === 0}
                            onClick={approveSelected}
                            data-test="approve-selected-commits-button"
                        >
                            <Check />
                            {approving
                                ? 'Approving…'
                                : selectedIds.length > 0
                                  ? `Approve ${selectedIds.length} ${selectedIds.length === 1 ? 'commit' : 'commits'}`
                                  : 'Approve selected'}
                        </Button>
                    </div>
                )}
            </div>

            <CommitFeed
                commits={commits}
                firstLane="var(--rail)"
                end="That's every pending commit."
                actions={(commit) => (
                    <ModerationActions
                        commit={commit}
                        isSelected={selected.has(commit.id)}
                        disabled={approving}
                        onSelectedChange={(isSelected) =>
                            toggle(commit.id, isSelected)
                        }
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
