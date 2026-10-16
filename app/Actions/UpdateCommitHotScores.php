<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\CommitStatus;
use App\Models\Commit;
use App\Services\TheAlgorithm;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

final readonly class UpdateCommitHotScores
{
    public function __construct(private TheAlgorithm $theAlgorithm)
    {
        //
    }

    /**
     * Rescores the threads the given commits are part of, and for quotes, the thread of the quoted commit too. The
     * threads are found right away, so callers deleting commits can pass them before they are gone.
     *
     * Engagement is the stars on the top-level commit plus every other developer taking part in its thread: replying
     * anywhere in it, or quoting any commit in it, since quotes show among the replies. Each developer counts once, so
     * a long back-and-forth between two people is not a hit, and pending or deleted commits do not count.
     *
     * Scores are counted once the change is committed, with the commit locked, so two stars landing at the same time
     * cannot each count without the other: whichever counts last sees both.
     *
     * @param  array<int, string>  $commitIds
     */
    public function handle(array $commitIds): void
    {
        $rootIds = Commit::query()
            ->withTrashed()
            ->whereKey($commitIds)
            ->with(['quotedCommit' => fn (BelongsTo $query): BelongsTo => $query->withTrashed()])
            ->get()
            ->flatMap(fn (Commit $commit): array => [$commit->threadRootId(), $commit->quotedCommit?->threadRootId()])
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($rootIds === []) {
            return;
        }

        DB::afterCommit(fn () => DB::transaction(function () use ($rootIds): void {
            Commit::query()->whereKey($rootIds)->orderBy('id')->lockForUpdate()->get(['id']);

            Commit::query()
                ->whereKey($rootIds)
                ->topLevel()
                ->withCount('stars')
                ->addSelect(['repliers_count' => DB::table('commits as engagements')
                    ->selectRaw('count(distinct engagements.user_id)')
                    ->where(fn (Builder $query): Builder => $query
                        ->whereColumn('engagements.root_id', 'commits.id')
                        ->orWhereColumn('engagements.quoted_commit_id', 'commits.id')
                        ->orWhereIn('engagements.quoted_commit_id', fn (Builder $thread): Builder => $thread
                            ->from('commits as thread')
                            ->select('thread.id')
                            ->whereColumn('thread.root_id', 'commits.id')))
                    ->whereColumn('engagements.user_id', '!=', 'commits.user_id')
                    ->where('engagements.status', CommitStatus::Approved)
                    ->whereNull('engagements.deleted_at')])
                ->get()
                ->each(fn (Commit $commit): int => Commit::query()->whereKey($commit->id)->toBase()->update([
                    'hot_score' => $this->theAlgorithm->score($commit->created_at, $commit->stars_count, (int) $commit->repliers_count),
                ]));
        }));
    }
}
